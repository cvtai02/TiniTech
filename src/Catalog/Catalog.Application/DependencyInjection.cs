using System.Reflection;
using Catalog.Application.Products.EventConsumers;
using FluentValidation;
using MassTransit;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SharedKernel.MediatRBehaviors;

namespace Catalog.Application;
public static class DependencyInjection
{
    public static void AddCatalogCore(this IHostApplicationBuilder builder)
    {
        builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        builder.Services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        });

        builder.Services.AddMassTransit(bus =>
        {
            bus.AddConsumer<RatingSubmittedConsumer>();
        });
    }
}