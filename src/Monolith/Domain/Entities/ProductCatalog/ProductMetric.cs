using Domain.Base;

namespace Domain.Entities;

public class ProductMetric : BaseEntity
{
    public int ProductId { get; set; }
    public int FeaturedPoint { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }
    public float RatingAvg { get; set; }
    public int RatingCount { get; set; }
    public int ViewCount { get; set; }
    public decimal LowestPrice { get; set; } = 0.00m;
    public virtual Product Product { get; set; } = null!;
}
