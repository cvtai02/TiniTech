using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contracts.Purchase.Interfaces;
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
    private readonly ICheckUserProductPurchase _purchaseChecker;

    public SubmitRating(DbContextAbstract dbContext, IUser user, IPublishEndpoint publishEndpoint, ICheckUserProductPurchase purchaseChecker)
    {
        _dbContext = dbContext;
        _user = user;
        _publishEndpoint = publishEndpoint;
        _purchaseChecker = purchaseChecker;
    }
    public async Task<int> Handle(SubmitRatingRequest s)
    {
        bool isUpdateRating = false;
        int oldRating = 0;
        if (_user.Id == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        if (s.Rating < 1 || s.Rating > 5)
        {
            throw new ArgumentOutOfRangeException(nameof(s.Rating), "Rating must be between 1 and 5.");
        }
        //Check if the user has purchase the product
        var isUserAbleToReview = await _purchaseChecker.GetUserProductPurchaseDate(_user.Id, s.ProductId);

        if (isUserAbleToReview == null)
        {
            throw new UnauthorizedAccessException("User is not purchase product yet.");
        }


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
            };
            _dbContext.ProductRatingSummaries.Add(productRattingSummary);
        }

        //Check if the user has already rated the product
        var userRating = await _dbContext.UserRatings
            .FirstOrDefaultAsync(r => r.UserId == _user.Id && r.ProductId == s.ProductId);

        if (userRating != null)
        {
            isUpdateRating = true;
            oldRating = userRating.Rating;
            switch (userRating.Rating)
            {
                case 1:
                    productRattingSummary.OneStar--;
                    break;
                case 2:
                    productRattingSummary.TwoStar--;
                    break;
                case 3:
                    productRattingSummary.ThreeStar--;
                    break;
                case 4:
                    productRattingSummary.FourStar--;
                    break;
                case 5:
                    productRattingSummary.FiveStar--;
                    break;
            }
            productRattingSummary.TotalRating--;

            userRating.Rating = s.Rating;
            userRating.Comment = s.Comment;
            userRating.UserName = s.UserName;
            userRating.Avatar = s.Avatar;
        }
        else
        {
            userRating = new UserRating
            {
                UserId = _user.Id,
                ProductId = s.ProductId,
                UserName = s.UserName,
                Avatar = s.Avatar,
                Rating = s.Rating,
                Comment = s.Comment,
            };
            _dbContext.UserRatings.Add(userRating);
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
            default:
                throw new ArgumentOutOfRangeException(nameof(s.Rating), "Rating must be between 1 and 5.");
        }
        productRattingSummary.TotalRating++;
        await _dbContext.SaveChangesAsync();
        if (!isUpdateRating)
        {
            await _publishEndpoint.Publish(new RatingCreated
            {
                RatingId = userRating.Id,
                Rating = s.Rating,
                ProductId = s.ProductId,
                UserId = _user.Id,
            });
        }
        else
        {
            await _publishEndpoint.Publish(new RatingUpdated
            {
                RatingId = userRating.Id,
                NewRating = s.Rating,
                OldRating = oldRating,
                ProductId = s.ProductId,
                UserId = _user.Id,
            });
        }

        return userRating.Id;
    }

}
