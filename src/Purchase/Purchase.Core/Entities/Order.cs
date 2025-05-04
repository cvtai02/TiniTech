using SharedKernel.Base;
using SharedKernel.Enums;
using SharedKernel.ValueObjects;

namespace Purchase.Core.Entities;

public class Order : BaseAuditableEntity
{
    public Address BillingAddress { get; set; } = null!;
    public OrderStatus Status { get; set; }
    public string Notes { get; set; } = String.Empty;
    public decimal ItemsPrice { get; set; }
    public decimal ShippingPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalCost { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}
