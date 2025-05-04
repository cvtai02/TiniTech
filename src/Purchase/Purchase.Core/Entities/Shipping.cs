using SharedKernel.Base;
using SharedKernel.ValueObjects;

namespace Purchase.Core.Entities;

public class Shipping : BaseEntity
{
    public int OrderId { get; set; }
    public int ShippingProviderId { get; set; }
    public Address To { get; set; } = null!;
    public Address From { get; set; } = null!;
    public decimal ShippingFee { get; set; }
    public string TrackingCode { get; set; } = null!;
    public ShippingProvider ShippingProvider { get; set; } = null!;
    public Order Order { get; set; } = null!;
}
