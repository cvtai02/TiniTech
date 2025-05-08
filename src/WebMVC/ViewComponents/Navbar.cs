using Microsoft.AspNetCore.Mvc;
using WebMVC.Models;
using WebMVC.Services.Abstractions;
using WebMVC.ViewComponents.Base;

namespace WebMVC.ViewComponents;

public class Navbar : BaseViewComponent<int>
{
    private readonly ICategoryService _categoryService;

    public Navbar(ICategoryService categoryService, ILogger<BaseViewComponent<int>> logger) : base(logger)
    {
        _categoryService = categoryService;
    }

    public override async Task<IViewComponentResult> GetView(int parameters)
    {
        var categories = await _categoryService.GetActiveCategoriesAsync(default);
        return View(categories);
    }

    // public async Task<IViewComponentResult> InvokeAsync()
    // {
    //     try
    //     {
    //         var categories = await _categoryService.GetActiveCategoriesAsync(default);
    //         return View(categories);
    //     }
    //     catch
    //     {
    //         // Log the exception if needed

    //         return View("../../Error", new ErrorViewModel
    //         {
    //             RequestId = HttpContext.TraceIdentifier,
    //         });
    //     }

    // }
}