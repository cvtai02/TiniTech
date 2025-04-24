using Domain.Base;

namespace Domain.Entities;

public class OrderItem : BaseEntity
{
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int VariantId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Note { get; set; } = null!;
    public Order? Order { get; set; } = null!;
    public Variant? Variant { get; set; } = null!;
}
