using Domain.Base;

namespace Domain.Entities;

public class OrderItem : BaseEntity
{
    public int OrderId { get; set; }
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Note { get; set; } = null!;
    public Order? Order { get; set; } = null!;
    public ProductVariant? ProductVariant { get; set; } = null!;
}
