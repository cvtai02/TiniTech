using WebSharedModels.Dtos.Attributes;
using WebSharedModels.Dtos.Products;

namespace WebSharedModels.Dtos.Orders;

public class OrderItemDto
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public string ProductName { get; set; } = "";
    public string ProductImageUrl { get; set; } = "";
    public decimal UnitPrice { get; set; }   // use for double checking
    public int Quantity { get; set; } = 1;
    public List<AttributeValueDto> AttributeValues { get; set; } = [];
}
