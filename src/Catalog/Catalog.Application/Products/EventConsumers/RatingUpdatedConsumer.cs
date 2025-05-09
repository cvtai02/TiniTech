using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Catalog.Application.Common.Abstraction;
using Contracts.RatingIntegrationEvents;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Application.Products.EventConsumers;
public class RatingUpdatedConsumer : IConsumer<RatingUpdated>
{
    private readonly DbContextAbstract _context;
    public RatingUpdatedConsumer(DbContextAbstract context)
    {
        _context = context;
    }
    public async Task Consume(ConsumeContext<RatingUpdated> context)
    {
        Console.WriteLine($"RatingUpdatedConsumer: {context.Message.RatingId} - {context.Message.UserId} - {context.Message.ProductId} - {context.Message.NewRating} - {context.Message.OldRating}");
        var productMetric = await _context.ProductMetrics.FirstOrDefaultAsync(x => x.ProductId == context.Message.ProductId, context.CancellationToken);
        if (productMetric == null)
        {
            // log here
            return;
        }
        productMetric.RatingAvg = (productMetric.RatingAvg * productMetric.RatingCount + context.Message.NewRating - context.Message.OldRating) / productMetric.RatingCount;

        await _context.SaveChangesAsync(context.CancellationToken);
    }

}
