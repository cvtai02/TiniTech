using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Purchase.Core.Abstraction;
using Purchase.Core.Entities;
using Purchase.Core.Services.OrderServices.CreateOrder;

namespace Purchase.Core.Services.CartServices.CreateOrder;

public class PersistOrderHandler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ConcurrentQueue<OrderQueueItem> _orderQueue;

    public PersistOrderHandler(IServiceScopeFactory serviceProvider, ConcurrentQueue<OrderQueueItem> orderQueue)
    {
        _orderQueue = orderQueue;
        _scopeFactory = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (_orderQueue.TryDequeue(out var order))
            {
                try
                {
                    // TODO: check stockitem quantity
                    using var scope = _scopeFactory.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<DbContextAbstract>();

                    dbContext.Orders.Add(order.Order);
                    await dbContext.SaveChangesAsync(stoppingToken);

                    order.OnSuccess(order.Order.Id);
                }
                catch (Exception ex)
                {
                    order.OnFailure(ex);
                }
            }
            else
            {
                // Avoid tight loop when queue is empty
                await Task.Delay(100, stoppingToken);
            }
        }
    }
}
