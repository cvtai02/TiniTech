using Microsoft.AspNetCore.Mvc;
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
        catch
        {
            // Log the exception if needed

            return View("../../Error", new ErrorViewModel
            {
                RequestId = HttpContext.TraceIdentifier,
            });
        }

    }
}