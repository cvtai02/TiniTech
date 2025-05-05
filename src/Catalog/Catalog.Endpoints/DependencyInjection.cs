using Application;
using Catalog.Endpoints.ExceptionHandler;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Catalog.Infrastructure;

namespace Catalog.Endpoints;
public static class DependencyInjection
{
    public static IHostApplicationBuilder AddCatalogModule(this IHostApplicationBuilder builder)
    {
        builder.AddCatalogCore();
        builder.AddCatalogInfra();
        builder.Services.AddExceptionHandler<CatalogExceptionHandler>();

        return builder;
    }
}