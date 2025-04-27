using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebMVC.Models;
using WebMVC.Services.Abstractions;
using SharedViewModels.Categories;

namespace WebMVC.Controllers;

[Route("category")]
public class CategoryController : Controller
{
    private readonly ILogger<CategoryController> _logger;
    private readonly ICategoryService _categoryService;

    public CategoryController(ILogger<CategoryController> logger, ICategoryService categoryService)
    {
        _logger = logger;
        _categoryService = categoryService;
    }

    // GET: Category/
    public async Task<IActionResult> Index()
    {
        try
        {
            var categories = await _categoryService.GetActiveCategoriesAsync(HttpContext.RequestAborted);
            return View(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

    // GET: Category/{slug}
    [HttpGet("{slug}")]
    public async Task<IActionResult> Details(string slug)
    {
        try
        {
            var categories = await _categoryService.GetActiveCategoriesAsync(HttpContext.RequestAborted);

            // Find the category by slug (either main category or subcategory)
            var category = categories.FirstOrDefault(c => c.Slug == slug);
            if (category == null)
            {
                category = categories
                    .SelectMany(c => c.Subcategories)
                    .FirstOrDefault(s => s.Slug == slug);
            }

            if (category == null)
            {
                return NotFound();
            }

            // Here you would typically get products for this category
            // This would require a product service that we don't have in the provided files

            ViewData["CategoryName"] = category.Name;
            ViewData["CategoryDescription"] = category.Description;

            return View(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category details for slug: {Slug}", slug);
            return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
