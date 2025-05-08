using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebMVC.Models;
using WebMVC.Services.Abstractions;
namespace WebMVC.Controllers;

public class HomeController : Controller
{
    private readonly IProductService _productService;

    public HomeController(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<IActionResult> IndexAsync(CancellationToken cancellationToken)
    {
        var bestSellerProducts = await _productService.GetBestSellerAsync(cancellationToken);
        var highlightedProducts = await _productService.GetFeaturedAsync(cancellationToken);


        return View(new HomeViewModel
        {
            BestSellers = bestSellerProducts.Items,
            FeaturedProducts = highlightedProducts.Items
        });
    }

    public IActionResult Privacy()
    {
        return View();
    }
}
