using System.Reflection;
using Identity.Core.Application.Common.Behaviours;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Identity.Core;
public static class DependencyInjection
{
    public static void AddCoreServices(this IHostApplicationBuilder builder)
    {
        // services.AddScoped<CreateUserHandler>();
        builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        builder.Services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        });
    }
}