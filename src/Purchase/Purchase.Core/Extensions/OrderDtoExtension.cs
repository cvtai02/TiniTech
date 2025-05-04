using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Purchase.Core.Entities;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Extensions;

public static class OrderExtension
{
    public static CreateOrderItemDto ToCreateOrderItemDto(this OrderItem orderItem)
    {
        return new CreateOrderItemDto
        {
            ProductId = orderItem.ProductId,
            VariantId = orderItem.VariantId,
            Quantity = orderItem.Quantity,
            UnitPrice = orderItem.UnitPrice
        };
    }
}
