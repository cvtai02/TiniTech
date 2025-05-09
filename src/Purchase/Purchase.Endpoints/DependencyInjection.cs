using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Purchase.Core;
using Purchase.Infrastructure;

namespace Purchase.Endpoints;

public static class DependencyInjection
{
    public static IHostApplicationBuilder AddPurchaseModule(this IHostApplicationBuilder builder)
    {
        builder.AddCore();
        builder.AddInfrastructureServices();
        // builder.Services.AddExceptionHandler<PurchaseExceptionHandler>();

        return builder;
    }
}
