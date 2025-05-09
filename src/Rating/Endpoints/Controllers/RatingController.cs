using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Rating.Core.Usecases.Queries;
using Rating.Core.UseCases.Commands;
using WebSharedModels.Dtos.Common;
using WebSharedModels.Dtos.Rating;

namespace Rating.Endpoints.Controllers;

[Route("ratings")]
public class RatingController : Controller
{
    private readonly ILogger<RatingController> _logger;
    private readonly GetProductRating _getProductRating;
    private readonly SubmitRating _submitRating;

    public RatingController(ILogger<RatingController> logger, GetProductRating getProductRating, SubmitRating submitRating)
    {
        _logger = logger;
        _getProductRating = getProductRating;
        _submitRating = submitRating;
    }

    [HttpGet()]
    public async Task<IActionResult> GetProductRatingAsync([FromQuery] ProductRatingQuery q)
    {
        var result = await _getProductRating.Handle(q);
        if (result == null)
        {
            return NotFound(
                new Response<ProductRatingDto>()
                {
                    Title = "Error",
                    Data = null,
                    Status = 400,
                    Detail = "No ratings found."
                });
        }
        return Ok(new Response<ProductRatingDto>()
        {
            Title = "Success",
            Data = result,
            Status = 200,
            Detail = "Ratings retrieved successfully."
        });
    }

    [HttpPost()]
    [Authorize]
    public async Task<IActionResult> SubmitRatingAsync([FromBody] SubmitRatingRequest r)
    {
        var result = await _submitRating.Handle(r);
        if (result == 0)
        {
            return BadRequest(
                new Response<int>()
                {
                    Title = "Error",
                    Data = result,
                    Status = 201,
                    Detail = "Failed to submit rating."
                });
        }
        return Ok(new Response<int>()
        {
            Title = "Success",
            Data = result,
            Status = 200,
            Detail = "Rating submitted successfully."
        });
    }
}
