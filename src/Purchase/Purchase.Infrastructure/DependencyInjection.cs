using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Purchase.Core.Abstraction;
using Purchase.Infrastructure.Data;
using Purchase.Infrastructure.ShippingInfras;

namespace Purchase.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        builder.Services.AddDbContext<ApplicationDbContext>((sprovider, options) =>
        {
            options.AddInterceptors(sprovider.GetServices<ISaveChangesInterceptor>());
            options.UseSqlServer(connectionString);
        });
        builder.Services.AddScoped<DbContextAbstract>(provider => provider.GetRequiredService<ApplicationDbContext>());

        builder.Services.AddScoped<IShippingFeeCalculator, ShippingFeeCalculator>();
    }
}