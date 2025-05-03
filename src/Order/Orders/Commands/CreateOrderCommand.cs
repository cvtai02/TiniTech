using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using SharedViewModels.Dtos.Orders;

namespace Application.Orders.Commands;

public class CreateOrderCommand : IRequest<Result<int>>
{
    public CreateOrderDto Order { get; set; } = null!;

    public Order ToOrder()
    {
        return new Order
        {
            BillingAddress = Order.BillingAddress,
            Status = OrderStatus.AwaitingPayment,
            Notes = Order.Notes,
            ItemsPrice = Order.ItemsPrice,
            ShippingPrice = Order.ShippingPrice,
            // Discount = Order.DiscountCode,
            TotalCost = Order.TotalPrice,
            OrderItems = [.. Order.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                VariantId = item.VariantId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
            })]

        };
    }
}

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        


        return 1;
    }
}