using SharedKernel.Base;

namespace Rating.Core.Entities;

public class ProductRatingSummary : BaseEntity
{
    public int OneStar { get; set; }
    public int TwoStar { get; set; }
    public int ThreeStar { get; set; }
    public int FourStar { get; set; }
    public int FiveStar { get; set; }
    public int TotalRating { get; set; }
    public double AverageRating => (OneStar + TwoStar * 2 + ThreeStar * 3 + FourStar * 4 + FiveStar * 5) / (double)TotalRating;
    public int ProductId { get; set; }
    public int TotalComment { get; set; } = 0;
}
