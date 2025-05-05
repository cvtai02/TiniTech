// ProjectName.Infrastructure/DependencyInjection.cs
using Application;
using Catalog.Endpoints.ExceptionHandler;
using Catalog.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Catalog.Endpoints;
public static class DependencyInjection
{
    public static IHostApplicationBuilder AddCatalogModule(this IHostApplicationBuilder builder)
    {
        builder.AddCatalogInfra();
        builder.AddCatalogCore();
        builder.Services.AddExceptionHandler<CatalogExceptionHandler>();

        return builder;
    }
}