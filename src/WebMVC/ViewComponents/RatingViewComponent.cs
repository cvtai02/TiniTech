using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebMVC.Services.Abstractions;
using WebSharedModels.Dtos.Rating;

namespace WebMVC.ViewComponents;

public class RatingViewComponent : ViewComponent
{
    private readonly IRatingService _ratingService;

    public RatingViewComponent(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    public async Task<IViewComponentResult> InvokeAsync(int productId, int page = 1, int pageSize = 10)
    {
        var ratings = await _ratingService.GetByProduct(productId, page, pageSize);
        return View(ratings);
    }
}
