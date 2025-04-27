using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using SharedViewModels.Categories;
using WebMVC.Models;
using WebMVC.Services.Abstractions;

namespace WebMVC.ViewComponents;

public class Navbar : ViewComponent
{
    private readonly ICategoryService _categoryService;

    public Navbar(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        try
        {
            var categories = await _categoryService.GetActiveCategoriesAsync(default);
            return View(categories);
        }
        catch (System.Exception ex)
        {
            // Log the exception if needed

            return View("../../Error", new ErrorViewModel
            {
                RequestId = HttpContext.TraceIdentifier,
            });
        }

    }
}