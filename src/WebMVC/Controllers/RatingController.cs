using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebMVC.Services.Abstractions;
using WebSharedModels.Dtos.Rating;

namespace WebMVC.Controllers;

public class RatingController : Controller
{
    private readonly ILogger<RatingController> _logger;
    private readonly IRatingService _ratingService;

    public RatingController(ILogger<RatingController> logger, IRatingService ratingService)
    {
        _logger = logger;
        _ratingService = ratingService;
    }

    [HttpPost("/api/ratings")]
    public async Task<IActionResult> SubmitRatingAsync([FromBody]SubmitRatingRequest model)
    {
        var r = await _ratingService.SubmitRatingAsync(model);
        return Ok(r);
    }

    [HttpGet("/api/ratings")]
    public async Task<IActionResult> GetRating([FromQuery] ProductRatingQuery model)
    {
        var r = await _ratingService.GetByProduct(model);
        return Ok(r);
    }
}
