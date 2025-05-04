using SharedKernel.Base;

namespace Purchase.Core.Entities;

public class ShippingProvider : BaseEntity
{
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string TrackingUrl { get; set; } = null!;
}
