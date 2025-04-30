using System.Diagnostics;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using SharedViewModels.Categories;
using SharedViewModels.ViewModels;
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
            BestSellers = bestSellerProducts,
            FeaturedProducts = highlightedProducts
        });
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
