using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
            .AddControllers();


        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

    }
}