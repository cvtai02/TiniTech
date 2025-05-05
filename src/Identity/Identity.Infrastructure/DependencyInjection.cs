// ProjectName.Infrastructure/DependencyInjection.cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Identity.Core.Application.Interfaces;
using Identity.Infrastructure.PasswordHasher;
using Identity.Infrastructure.Jwt;
using Identity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Identity.Infrastructure
{
    public static class DependencyInjection
    {
        public static void AddIdentityInfra(this IHostApplicationBuilder builder)
        {

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

            builder.Services.AddDbContext<ApplicationDbContext>((sprovider, options) =>
            {
                options.AddInterceptors(sprovider.GetServices<ISaveChangesInterceptor>());
                options.UseSqlServer(connectionString);
            });
            builder.Services.AddScoped<DbContextAbstract>(provider => provider.GetRequiredService<ApplicationDbContext>());
            // builder.Services.AddScoped<ApplicationDbContextInitializer>();

            builder.Services.ConfigureOptions<JwtOptionConfig>();
            builder.Services.AddTransient<ITokenService, JwtService>();
            builder.Services.AddTransient<IPasswordHasher, SHA256PasswordHasher>();
        }
    }
}