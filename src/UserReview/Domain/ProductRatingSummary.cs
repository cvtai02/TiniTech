using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class ProductRatingSummary : BaseEntity
{
    public int OneStar { get; set; }
    public int TwoStar { get; set; }
    public int ThreeStar { get; set; }
    public int FourStar { get; set; }
    public int FiveStar { get; set; }
    public int TotalRating { get; set; }
    public double AverageRating { get; set; } = 0.0;
    public int ProductId { get; set; }
    public Product? Product { get; set; } = null!;
    public int TotalComment { get; set; } = 0;
}
