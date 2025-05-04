using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Purchase.Core.Entities;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Extensions;

public static class CartItemExtension
{
    public static OrderItemDto ToOrderItemDto(this CartItem cartItem)
    {
        return new OrderItemDto
        {
            ProductId = cartItem.StockItem.ProductId,
            VariantId = cartItem.StockItem.VariantId,
            Quantity = cartItem.Quantity,
            UnitPrice = cartItem.StockItem.Price
        };
    }

}
