using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Rating.Core.Interfaces;
using Rating.Infrastructure.Data;

namespace Rating.Infrastructure;
public static class DependencyInjection
{
    public static void AddRatingInfra(this IHostApplicationBuilder builder)
    {

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        builder.Services.AddDbContext<ApplicationDbContext>((sprovider, options) =>
        {
            options.AddInterceptors(sprovider.GetServices<ISaveChangesInterceptor>());
            options.UseSqlServer(connectionString);
        });
        builder.Services.AddScoped<DbContextAbstract>(provider => provider.GetRequiredService<ApplicationDbContext>());
    }
}