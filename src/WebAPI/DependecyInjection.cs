using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using SharedKernel.Interfaces;
using WebAPI.Middlewares;
using WebAPI.ServiceCollectionExtensions;
using WebAPI.Services;

namespace WebAPI;

public static class DependencyInjection
{
    public static void AddWebServices(this IHostApplicationBuilder builder)
    {

        builder.Services.AddOpenApi().AddSwaggerGenWithAuth();
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<IUser, CurrentUser>();
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>()
            .AddProblemDetails()
            .AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });


        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

    }
}