// ProjectName.Infrastructure/DependencyInjection.cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Identity.Infrastructure.Jwt;
using Identity.Core;
using Identity.Endpoints.ExceptionHandler;
using Identity.Infrastructure;

namespace Identity.Endpoints;
public static class DependencyInjection
{
    public static void AddIdentityModule(this IHostApplicationBuilder builder)
    {
        builder.Services.ConfigureOptions<JwtOptionConfig>();
        builder.AddCoreServices();
        builder.AddInfrastructureServices();
        builder.Services.AddExceptionHandler<IdentityExceptionHandler>();
    }
}