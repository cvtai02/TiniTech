using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrossCutting.Exceptions;
using CrossCutting.Extensions;
using SharedKernel.Models;
using WebMVC.Exceptions;
using WebMVC.Services.Abstractions;
using WebMVC.Services.Base;
using WebSharedModels.Dtos.Common;
using WebSharedModels.Dtos.Rating;

namespace WebMVC.Services.Specifications;

public class RatingService : IRatingService
{
    private readonly ApiService _apiService;

    public RatingService(ApiService apiService)
    {
        _apiService = apiService;
    }

    public async Task<ProductRatingDto> GetByProduct(ProductRatingQuery query)
    {
        var ratings = await _apiService.GetDataAsync<ProductRatingDto>($"ratings?productId={query.ProductId}&page={query.Page}&pageSize={query.PageSize}");
        return ratings.Data ?? throw new NotFoundException("Ratings not found", new Exception(ratings.Detail));
    }

    public async Task<int> SubmitRatingAsync(SubmitRatingRequest ratingDto)
    {
        var response = await _apiService.PostDataAsync<SubmitRatingRequest, int>("ratings", ratingDto);
        return response.Data;
    }
}
