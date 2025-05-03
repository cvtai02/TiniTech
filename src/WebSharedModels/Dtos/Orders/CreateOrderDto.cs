using SharedKernel.ValueObjects;

namespace WebSharedModels.Dtos.Orders;


public class CreateOrderDto
{
    public int? CustomerId { get; set; }
    public Address BillingAddress { get; set; } = null!;
    public List<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
    public string Notes { get; set; } = "";
    public decimal ItemsPrice { get; set; }
    public int DiscountCode { get; set; }
    public decimal ShippingPrice { get; set; }
    public int ShippingProviderId { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public int Quantity { get; set; }
    public string Name { get; set; } = null!;
    public decimal UnitPrice { get; set; }
}