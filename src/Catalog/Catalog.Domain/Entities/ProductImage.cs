namespace Catalog.Domain.Entities;

public class ProductImage : BaseEntity
{
    public int ProductId { get; set; }
    public float OrderPriority { get; set; }
    public string ImageUrl { get; set; } = null!;
    public Product? Product { get; set; } = null!;
}