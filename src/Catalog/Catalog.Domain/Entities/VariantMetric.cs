namespace Catalog.Domain.Entities;

public class VariantMetric : BaseEntity
{
    public int VariantId { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }

    public Variant? Variant { get; set; } = null!;
}
