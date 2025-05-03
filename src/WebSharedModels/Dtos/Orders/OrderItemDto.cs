using WebSharedModels.Dtos.Attributes;

namespace WebSharedModels.Dtos.Orders;

public class OrderItemDto
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public int Quantity { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public string? Note { get; set; } = null!;
    public Dictionary<AttributeDto, string> Attributes { get; set; } = new();

}
