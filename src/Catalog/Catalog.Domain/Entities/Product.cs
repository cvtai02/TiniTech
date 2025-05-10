using CrossCutting.Extensions;

namespace Catalog.Domain.Entities;

public class Product : BaseAuditableEntity
{
    private string _name = string.Empty;

    public string Name
    {
        get => _name;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Product name cannot be empty or whitespace.", nameof(value));
            }
            else
            {
                _name = char.ToUpper(value[0]) + value[1..];
            }
            Slug = value.ToSlug(DateTimeOffset.Now.ToYymmddhhmmss());
        }
    }
    public string Sku { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string Slug { get; set; } = null!;
    public string ImageUrl { get; set; } = string.Empty;
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public Category Category { get; set; } = null!;
    public List<ProductImage> Images { get; set; } = [];
    public List<ProductAttribute> Attributes { get; set; } = [];
    public virtual List<Variant> Variants { get; set; } = [];
    public ProductMetric Metric { get; set; } = null!;

}
