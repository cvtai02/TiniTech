using SharedKernel.ValueObjects;

namespace WebSharedModels.Dtos.Orders;


public class CreateOrderDto
{
    public string? CustomerId { get; set; }
    public Address BillingAddress { get; set; } = null!;
    public List<CreateOrderItemDto> Items { get; set; } = [];
    public string Notes { get; set; } = "";
    public decimal ItemsPrice { get; set; }
    public int DiscountCode { get; set; }
    public decimal ShippingPrice { get; set; }
    public int ShippingProviderId { get; set; }
    public decimal TotalPrice { get; set; }
}
