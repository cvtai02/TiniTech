using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contracts.RatingIntegrationEvents;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Rating.Core.Entities;
using Rating.Core.Interfaces;
using SharedKernel.Interfaces;
using WebSharedModels.Dtos.Rating;

namespace Rating.Core.UseCases.Commands;

public class SubmitRating
{
    private readonly DbContextAbstract _dbContext;
    private readonly IUser _user;
    private readonly IPublishEndpoint _publishEndpoint;

    public SubmitRating(DbContextAbstract dbContext, IUser user, IPublishEndpoint publishEndpoint)
    {
        _publishEndpoint = publishEndpoint;
        _dbContext = dbContext;
        _user = user;
    }

    public async Task<int> Handle(SubmitRatingRequest s)
    {
        if (string.IsNullOrEmpty(_user.Id))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userRating = new UserRating
        {
            UserId = _user.Id,
            ProductId = s.ProductId,
            UserName = s.UserName,
            Avatar = s.Avatar,
            Rating = s.Rating,
            Comment = s.Comment,
        };

        var productRattingSummary = await _dbContext.ProductRatingSummaries
            .FirstOrDefaultAsync(r => r.ProductId == s.ProductId);

        if (productRattingSummary == null)
        {
            productRattingSummary = new ProductRatingSummary
            {
                ProductId = s.ProductId,
                OneStar = 0,
                TwoStar = 0,
                ThreeStar = 0,
                FourStar = 0,
                FiveStar = 0,
                TotalRating = 0,
                AverageRating = 0
            };
            _dbContext.ProductRatingSummaries.Add(productRattingSummary);
        }

        // Update the summary based on the new rating
        switch (s.Rating)
        {
            case 1:
                productRattingSummary.OneStar++;
                break;
            case 2:
                productRattingSummary.TwoStar++;
                break;
            case 3:
                productRattingSummary.ThreeStar++;
                break;
            case 4:
                productRattingSummary.FourStar++;
                break;
            case 5:
                productRattingSummary.FiveStar++;
                break;
        }
        productRattingSummary.TotalRating++;
        productRattingSummary.AverageRating = (productRattingSummary.OneStar + productRattingSummary.TwoStar * 2 + productRattingSummary.ThreeStar * 3 + productRattingSummary.FourStar * 4 + productRattingSummary.FiveStar * 5) / (double)productRattingSummary.TotalRating;

        _dbContext.UserRatings.Add(userRating);
        // Add outbox
        await _dbContext.SaveChangesAsync();
        
        await _publishEndpoint.Publish(new RatingSubmitted
        {
            RatingId = userRating.Id,
            UserId = userRating.UserId,
            ProductId = userRating.ProductId,
            Rating = userRating.Rating,
            Comment = userRating.Comment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        return userRating.Id;
    }

}
