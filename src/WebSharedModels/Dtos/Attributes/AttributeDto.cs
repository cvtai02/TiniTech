namespace WebSharedModels.Dtos.Attributes;

public class AttributeDto
{
    public int AttributeId { get; set; }
    public string Name { get; set; } = null!;
    public float OrderPriority { get; set; }
    public bool IsPrimary { get; set; }
    public List<AttributeValueDto> Values { get; set; } = [];
}