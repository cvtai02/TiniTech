using Microsoft.AspNetCore.Mvc;
using WebMVC.Services.Abstractions;
using WebMVC.ViewComponents.Base;
using WebSharedModels.Dtos.Rating;

namespace WebMVC.ViewComponents;

public class Rating : BaseViewComponent<ProductRatingQuery>
{
    private readonly IRatingService _ratingService;

    public Rating(IRatingService ratingService, ILogger<BaseViewComponent<ProductRatingQuery>> logger) : base(logger)
    {
        _ratingService = ratingService;
    }


    public override async Task<IViewComponentResult> GetView(ProductRatingQuery parameters)
    {
        var ratings = await _ratingService.GetByProduct(parameters);
        return View(ratings);
    }
}

