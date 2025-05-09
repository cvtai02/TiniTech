using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebMVC.Models;
using WebMVC.Services.Abstractions;

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


    [HttpGet("{slug}")]
    public async Task<IActionResult> InfoAsync(string slug, CancellationToken cancellationToken)
    {
        var product = await _productService.GetBySlugAsync(slug, cancellationToken);
        var relatedProducts = await _productService.GetRelated(product.Id, cancellationToken);
        return View(new ProductViewModel
        {
            Product = product,
            RelatedProducts = relatedProducts,
        });
    }

}
