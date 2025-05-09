using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrossCutting.Exceptions;
using Microsoft.EntityFrameworkCore;
using Rating.Core.Interfaces;
using SharedKernel.Models;
using WebSharedModels.Dtos.Rating;

namespace Rating.Core.Usecases.Queries;

public class GetProductRating
{
    private readonly DbContextAbstract _dbContext;

    public GetProductRating(DbContextAbstract dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductRatingDto> Handle(ProductRatingQuery request)
    {
        // Concurent error

        //var ratingsTask = _dbContext.UserRatings
        //    .Where(r => r.ProductId == request.ProductId)
        //    .OrderByDescending(r => r.Created)
        //    .Skip((request.Page - 1) * request.PageSize)
        //    .Take(request.PageSize)
        //    .ToListAsync();

        //var ratingSummaryTask = _dbContext.ProductRatingSummaries
        //    .Where(r => r.ProductId == request.ProductId)
        //    .Select(r => new RatingSummaryDto
        //    {
        //        OneStar = r.OneStar,
        //        TwoStar = r.TwoStar,
        //        ThreeStar = r.ThreeStar,
        //        FourStar = r.FourStar,
        //        FiveStar = r.FiveStar,
        //        TotalRating = r.TotalRating,
        //        AverageRating = r.AverageRating,
        //        ProductId = r.ProductId
        //    })
        //    .FirstOrDefaultAsync();

        //await Task.WhenAll(ratingsTask, ratingSummaryTask);

        //// Access results safely
        //var ratings = await ratingsTask;
        //var ratingSummary = await ratingSummaryTask;

        var ratings = await _dbContext.UserRatings
            .Where(r => r.ProductId == request.ProductId)
            .OrderByDescending(r => r.LastModified)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        if (ratings == null)
        {
            throw new NotFoundException("Product user ratings not found.");
        }

        var ratingSummary = await _dbContext.ProductRatingSummaries
            .Where(r => r.ProductId == request.ProductId)
            .Select(r => new RatingSummaryDto
            {
                OneStar = r.OneStar,
                TwoStar = r.TwoStar,
                ThreeStar = r.ThreeStar,
                FourStar = r.FourStar,
                FiveStar = r.FiveStar,
                TotalRating = r.TotalRating,
                AverageRating = r.AverageRating,
                ProductId = r.ProductId
            })
            .FirstOrDefaultAsync();

        if (ratingSummary == null)
        {
            throw new NotFoundException("Product rating summary not found.");
        }

        var userRatings = ratings.Select(r => new UserRatingDto
        {
            UserId = r.UserId,
            ProductId = r.ProductId,
            UserName = r.UserName,
            Avatar = r.Avatar,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.Created.DateTime,
            UpdatedAt = r.LastModified.DateTime
        }).ToList();

        return new ProductRatingDto
        {
            Ratings = new PaginatedList<UserRatingDto>(userRatings, ratingSummary.TotalRating, request.Page, request.PageSize),
            Summary = ratingSummary,
        };
    }



}
