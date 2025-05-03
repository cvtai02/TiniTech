namespace Catalog.Domain.Entities;

public class ProductAttributeValue : BaseEntity
{
    public int ProductAttributeId { get; set; }
    public string Value { get; set; } = null!;
    public string? ImageUrl { get; set; } = null!;
    public float OrderPriority { get; set; } = 0;
    public ProductAttribute? ProductAttribute { get; set; } = null!;

    public bool IsValueEqual(string value)
    {
        return string.Equals(Value, value, StringComparison.OrdinalIgnoreCase);
    }

}
