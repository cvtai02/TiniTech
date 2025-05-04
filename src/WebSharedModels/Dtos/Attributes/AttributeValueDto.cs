namespace WebSharedModels.Dtos.Attributes;

public class AttributeValueDto
{
    public int? AttributeId { get; set; }
    public string? Name { get; set; }
    public float OrderPriority { get; set; }
    public string Value { get; set; } = null!;
    public string? ImageUrl { get; set; }
}
