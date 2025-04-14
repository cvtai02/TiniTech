using Domain.Base;

namespace Domain.Entities;

public class VariantPrimaryAttribute : BaseEntity
{
    public int ProductVariantId { get; set; }
    public int AttributeId { get; set; }
    public string Value { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public Attribute? Attribute { get; set; } = null!;
}

