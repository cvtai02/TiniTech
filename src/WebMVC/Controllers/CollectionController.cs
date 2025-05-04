using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebMVC.Models;
using WebMVC.Services.Abstractions;
using WebSharedModels.Dtos.Products;

namespace WebMVC.Controllers;

[Route("collections")]
public class CollectionController : Controller
{
    private readonly ILogger<CollectionController> _logger;
    private readonly ICategoryService _categoryService;
    private readonly IProductService _productService;

    public CollectionController(ILogger<CollectionController> logger, ICategoryService categoryService, IProductService productService)
    {
        _logger = logger;
        _categoryService = categoryService;
        _productService = productService;
    }

    public IActionResult Index()
    {
        return RedirectToAction("Details", new { slug = "whatever" });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> Details(string slug, [FromQuery] ProductQueryParameters parameters)
    {
        try
        {
            if (slug == "whatever")
            {
            }
            else
            {
                parameters.CategorySlug = slug;
            }
            var categories = await _categoryService.GetActiveCategoriesAsync(HttpContext.RequestAborted);
            var products = await _productService.GetByQueryAsync(parameters, HttpContext.RequestAborted);

            Console.WriteLine($"Query Parameters: {parameters}");
            Console.WriteLine($"total products: {products.TotalCount}");

            return View(new CollectionViewModel
            {
                Categories = categories,
                Products = products,
                QueryParameters = parameters
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category details for slug: {Slug}", slug);
            return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

}
