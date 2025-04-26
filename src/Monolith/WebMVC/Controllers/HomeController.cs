using System.Diagnostics;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using SharedViewModels.Categories;
using WebMVC.Models;

namespace WebMVC.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        var category = new CategoryDto
        {
            Id = 1,
            Name = "Electronics",
            Description = "Devices and gadgets",
            Slug = "electronics",
            Status = CategoryStatus.Active,
            ParentId = null,
            Subcategories = new List<CategoryDto>
            {
                new CategoryDto { Id = 2, Name = "Laptops", Description = "Portable computers", Slug = "laptops" },
                new CategoryDto { Id = 3, Name = "Phones", Description = "Smartphones", Slug = "phones" }
            }
        };

        return View(category);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
