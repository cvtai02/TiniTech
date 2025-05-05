using Catalog.Application.Common.Abstraction;
using Catalog.Infrastructure.CloudinaryService;
using Catalog.Infrastructure.Data;
using Catalog.Infrastructure.Data.Interceptors;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Catalog.Infrastructure;
public static class DependencyInjection
{
    internal static void AddCatalogInfra(this IHostApplicationBuilder builder)
    {

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        builder.Services.AddDbContext<ApplicationDbContext>((sprovider, options) =>
        {
            options.AddInterceptors(sprovider.GetServices<ISaveChangesInterceptor>());
            options.UseSqlServer(connectionString);
        });
        builder.Services.AddScoped<DbContextAbstract>(provider => provider.GetRequiredService<ApplicationDbContext>());
        builder.Services.AddScoped<ApplicationDbContextInitializer>();
        builder.Services.AddScoped<IImageService, CloudinaryImageService>();
        builder.Services.AddSingleton(TimeProvider.System);
    }
}