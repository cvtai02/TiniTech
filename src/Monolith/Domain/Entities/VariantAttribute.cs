using Domain.Base;

namespace Domain.Entities;

public class VariantAttribute : BaseEntity
{
    public int ProductVariantId { get; set; }
    public int AttributeId { get; set; }
    public string Value { get; set; } = null!;
    public AttributeEntity? Attribute { get; set; } = null!;
    public ProductVariant? ProductVariant { get; set; } = null!;

}
