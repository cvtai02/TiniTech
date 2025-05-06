using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using SharedKernel.Interfaces;
using WebAPI.Configurations;
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

        builder.Services.ConfigureOptions<JwtValidationConfig>();

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>()
            .AddProblemDetails()
            .AddHttpContextAccessor()
            .AddJwtCookieAuthentication()
            .AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        return builder;
    }
}