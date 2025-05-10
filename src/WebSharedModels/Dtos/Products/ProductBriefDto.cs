using SharedKernel.Enums;

namespace WebSharedModels.Dtos.Products;

public class ProductBriefDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Sku { get; set; } = null!;
    public decimal Price { get; set; }
    public int FeaturedPoint { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public string ImageUrl { get; set; } = null!;
    public float Rating { get; set; }
    public int RatingCount { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }
    public DateTimeOffset Created { get; set; }
    public DateTimeOffset LastModified { get; set; }
}
