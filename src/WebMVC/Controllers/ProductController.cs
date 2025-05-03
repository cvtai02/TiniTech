using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebMVC.Models;
using WebMVC.Services.Abstractions;
using WebSharedModels.ViewModels;

namespace WebMVC.Controllers;

[Route("products")]
public class ProductController : Controller
{
    private readonly ILogger<ProductController> _logger;
    private readonly IProductService _productService;

    public ProductController(ILogger<ProductController> logger, IProductService productService)
    {
        _logger = logger;
        _productService = productService;
    }

    public IActionResult Index()
    {
        return RedirectToRoute("Default", new { controller = "Home", action = "Index" });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> InfoAsync(string slug, CancellationToken cancellationToken)
    {
        try
        {
            var product = await _productService.GetBySlugAsync(slug, cancellationToken);
            var relatedProducts = await _productService.GetRelated(product.Id, cancellationToken);
            return View(new ProductViewModel
            {
                Product = product,
                RelatedProducts = relatedProducts,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product details for slug: {Slug}", slug);
            return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View("Error!");
    }
}
