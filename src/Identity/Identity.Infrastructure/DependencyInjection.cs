// ProjectName.Infrastructure/DependencyInjection.cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Identity.Core.Application.Interfaces;
using Identity.Infrastructure.PasswordHasher;
using Identity.Infrastructure.Jwt;
using Identity.Infrastructure.Data;

namespace Identity.Infrastructure
{
    public static class DependencyInjection
    {
        public static void AddIdentityInfra(this IHostApplicationBuilder builder)
        {
            builder.Services.AddScoped<DbContextAbtract, ApplicationDbContext>();
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.ConfigureOptions<JwtOptionConfig>();
            builder.Services.AddTransient<ITokenService, JwtService>();
            builder.Services.AddTransient<IPasswordHasher, SHA256PasswordHasher>();
        }
    }
}