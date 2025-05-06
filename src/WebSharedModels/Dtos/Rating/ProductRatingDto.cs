using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedKernel.Models;

namespace WebSharedModels.Dtos.Rating;

public class ProductRatingDto
{
    public PaginatedList<UserRatingDto> Ratings { get; set; } = new();
    public RatingSummaryDto Summary { get; set; } = new();

}

public class RatingSummaryDto
{
    public int OneStar { get; set; }
    public int TwoStar { get; set; }
    public int ThreeStar { get; set; }
    public int FourStar { get; set; }
    public int FiveStar { get; set; }
    public int TotalRating { get; set; }
    public double AverageRating { get; set; } = 0.0;
    public int ProductId { get; set; }
}
