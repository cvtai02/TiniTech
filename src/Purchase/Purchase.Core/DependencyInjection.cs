using System.Collections.Concurrent;
using Contracts.Purchase.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Purchase.Core.ContractsImp;
using Purchase.Core.Services.CartServices;
using Purchase.Core.Services.CartServices.CreateOrder;
using Purchase.Core.Services.OrderServices;
using Purchase.Core.Services.OrderServices.CreateOrder;

namespace Purchase.Core;

public static class DependencyInjection
{
    public static void AddCore(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<AddItemToCart>();
        builder.Services.AddScoped<UpdateCartItemQuantityAsync>();
        builder.Services.AddScoped<GetCartItems>();

        builder.Services.AddScoped<CreateOrder>();
        builder.Services.AddScoped<GetOrders>();
        builder.Services.AddScoped<UpdateOrderStatus>();
        builder.Services.AddScoped<GetUserOrders>();
        builder.Services.AddScoped<UpdateOrderStatus>();

        builder.Services.AddScoped<ICheckUserProductPurchase, CheckUserProductPurchase>();

        builder.Services.AddSingleton<ConcurrentQueue<OrderQueueItem>>();

        builder.Services.AddHostedService<PersistOrderHandler>();
    }
}