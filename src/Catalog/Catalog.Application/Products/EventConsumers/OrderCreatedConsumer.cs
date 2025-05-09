using Catalog.Application.Common.Abstraction;
using Contracts.Purchase.Events;
using CrossCutting.Exceptions;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Application.Products.EventConsumers;

public class OrderCreatedConsumer : IConsumer<OrderCreated>
{
    private readonly DbContextAbstract _context;
    public OrderCreatedConsumer(DbContextAbstract context)
    {
        _context = context;
    }
    public async Task Consume(ConsumeContext<OrderCreated> context)
    {
        foreach (var item in context.Message.Items)
        {
            if (item.VariantId == null)
            {
                var product = await _context.Products
                    .Include(x => x.Metric)
                    .FirstOrDefaultAsync(x => x.Id == item.ProductId);

                if (product == null)
                    // log here
                    continue;

                product.Metric.Stock -= item.Quantity;
                product.Metric.Sold += item.Quantity;
                product.Metric.FeaturedPoint++;
            }
            else
            {
                var variant = await _context.Variants
                    .Include(x => x.Metric)
                    .Include(x => x.Product)
                        .ThenInclude(x => x.Metric)
                    .Where(x => x.Id == item.VariantId)
                    .FirstOrDefaultAsync(context.CancellationToken);
                if (variant == null)
                    // log here
                    continue;

                variant.Metric.Stock -= item.Quantity;
                variant.Metric.Sold += item.Quantity;
                variant.Product.Metric.Sold++;
                variant.Product.Metric.Stock -= item.Quantity;
                variant.Product.Metric.FeaturedPoint++;
            }
        }

        await _context.SaveChangesAsync(context.CancellationToken);
    }
}