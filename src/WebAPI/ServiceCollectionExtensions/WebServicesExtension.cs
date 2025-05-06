using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using SharedKernel.Interfaces;
using WebAPI.ExceptionHandlers;
using WebAPI.ServiceCollectionExtensions;
using WebAPI.Services;

namespace WebAPI.ServiceCollectionExtensions;

public static class WebServicesExtension
{
    public static IHostApplicationBuilder AddWebServices(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<IUser, CurrentUser>();

        builder.Services.AddOpenApi().AddSwaggerGenWithAuth();

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>()
            .AddProblemDetails()
            .AddHttpContextAccessor()
            .AddJwtCookieAuthentication(builder.Configuration)
            .AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        return builder;
    }
}