using Domain.Base;

namespace Domain.Entities;

public class VariantAttribute : BaseEntity
{
    public int VariantId { get; set; }
    public int AttributeId { get; set; }
    public string Value { get; set; } = null!;
    public Variant Variant { get; set; } = null!;
    public AttributeEntity Attribute { get; set; } = null!;

}
