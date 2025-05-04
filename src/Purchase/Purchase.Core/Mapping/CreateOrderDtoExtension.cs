using Purchase.Core.Entities;
using SharedKernel.Constants;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Mapping;

public static class CreateOrderDtoExtension
{
    public static Order ToOrder(this CreateOrderDto orderDto)
    {
        return new Order
        {
            UserId = orderDto.CustomerId,
            BillingAddress = orderDto.BillingAddress,
            Notes = orderDto.Notes,
            ItemsPrice = orderDto.ItemsPrice,
            ShippingFee = orderDto.ShippingPrice,
            // Discount = orderDto.DiscountCode,
            TotalCost = orderDto.TotalPrice,
            OrderItems = [.. orderDto.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                VariantId = item.VariantId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
            })],
        };
    }

    public static Shipping ToShipping(this CreateOrderDto orderDto)
    {
        return new Shipping
        {
            ShippingProviderId = orderDto.ShippingProviderId,
            From = ShopAddress.Value,
            To = orderDto.BillingAddress,
        };
    }

}
