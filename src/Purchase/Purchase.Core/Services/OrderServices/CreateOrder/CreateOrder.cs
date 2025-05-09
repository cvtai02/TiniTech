using System.Collections.Concurrent;
using Contracts.Purchase.Events;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Http;
using Purchase.Core.Abstraction;
using Purchase.Core.Entities;
using Purchase.Core.Exceptions;
using Purchase.Core.Mapping;
using SharedKernel.Enums;
using SharedKernel.Interfaces;
using WebSharedModels.Dtos.Orders;

namespace Purchase.Core.Services.OrderServices.CreateOrder;

public class CreateOrder
{
    private readonly ConcurrentQueue<OrderQueueItem> _orderQueue;
    private readonly IShippingFeeCalculator _shippingFeeCalculator;
    private readonly IUser _user;
    private readonly IPublishEndpoint _publisher;

    public CreateOrder(
        ConcurrentQueue<OrderQueueItem> orderQueue,
        IShippingFeeCalculator shippingFeeCalculator,
        IUser user,
        IPublishEndpoint publisher)
    {
        _orderQueue = orderQueue;
        _shippingFeeCalculator = shippingFeeCalculator;
        _user = user;
        _publisher = publisher;
    }
    public async Task<int> Handle(CreateOrderDto orderDto)
    {
        var order = orderDto.ToOrder();
        order.Status = OrderStatus.Preparing;
        order.UserId = _user.Id;

        var shippingFee = await _shippingFeeCalculator.CalculateShippingCostAsync(orderDto);
        order.ShippingFee = shippingFee;

        var shipping = orderDto.ToShipping();
        order.Shipping = shipping;

        var tcs = new TaskCompletionSource<int>();

        var orderQueueItem = new OrderQueueItem
        {
            Order = order,
            OnSuccess = (orderId) =>
            {
                try
                {
                    _publisher.Publish(new OrderCreated
                    {
                        OrderId = orderId,
                        UserId = order.UserId,
                        Items = [.. order.OrderItems.Select(i => new Contracts.Purchase.OrderItem
                        {
                            ProductId = i.ProductId,
                            VariantId = i.VariantId,
                            Quantity = i.Quantity,
                            Price = i.UnitPrice,
                        })],
                    });
                    tcs.TrySetResult(orderId);
                }
                catch (Exception ex)
                {
                    tcs.TrySetException(ex);
                }
            },
            OnFailure = (ex) =>
            {
                tcs.TrySetException(new OrderCreateFailException("Failed to process order", ex));
            }
        }
        ;

        _orderQueue.Enqueue(orderQueueItem);

        // Wait for the background processing to complete and return the actual order ID.
        return await tcs.Task;
    }


}