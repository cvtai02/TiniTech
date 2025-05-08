using Catalog.Application.Common.Abstraction;
using Catalog.Domain.Entities;
using CrossCutting.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Products;

namespace Catalog.Application.Products.Commands.UpdateProductInfo;

public class UpdateProductInfoCommand : IRequest<Result<string>>
{
    public ProductDetailDto New { get; set; } = null!;
}

public class UpdateProductInfoCommandHandler : IRequestHandler<UpdateProductInfoCommand, Result<string>>
{
    private readonly DbContextAbstract _context;

    public UpdateProductInfoCommandHandler(DbContextAbstract dbContext)
    {
        _context = dbContext;
    }

    public async Task<Result<string>> Handle(UpdateProductInfoCommand request, CancellationToken cancellationToken)
    {
        // Find the product by id
        var product = await _context.Products
            .Include(p => p.Metric)
            .Include(p => p.Variants)
            .Include(p => p.Attributes)
                .ThenInclude(p => p.ProductAttributeValues)
            .FirstOrDefaultAsync(p => p.Id == request.New.Id, cancellationToken);


        if (product == null)
        {
            return new NotFoundException($"Product {request.New.Id} not found.");
        }

        // Update product properties
        if (product.Name != request.New.Name)
        {
            // avoid change slug
            product.Name = request.New.Name;
        }

        product.Sku = request.New.Sku;
        product.Description = request.New.Description ?? string.Empty;
        // product.Status = request.New.Status;     not allow to update status
        product.CategoryId = request.New.CategoryId;
        product.Metric.LowestPrice = request.New.Price;
        product.Metric.FeaturedPoint = request.New.FeaturedPoint;


        // attributes
        foreach (var attribute in request.New.Attributes)
        {
            var existingAttribute = product.Attributes.FirstOrDefault(a => a.AttributeId == attribute.AttributeId);
            // If the attribute already exists, consider the values to be updated
            if (existingAttribute != null)
            {
                // find removed values
                var valuesToRemove = existingAttribute.ProductAttributeValues
                    .Where(v => !attribute.Values.Any(av => av.Value == v.Value)).ToList();

                foreach (var value in valuesToRemove)
                {
                    existingAttribute.ProductAttributeValues.Remove(value);
                }

                // find added values
                var valuesToAdd = attribute.Values
                    .Where(v => !existingAttribute.ProductAttributeValues.Any(av => av.Value == v.Value)).ToList();
                foreach (var value in valuesToAdd)
                {
                    existingAttribute.ProductAttributeValues.Add(new ProductAttributeValue
                    {
                        Value = value.Value,
                        OrderPriority = value.OrderPriority,
                        ImageUrl = value.ImageUrl,
                    });
                }
            }
            else
            {
                product.Attributes.Add(new ProductAttribute
                {
                    AttributeId = attribute.AttributeId,
                    IsPrimary = attribute.IsPrimary,
                    OrderPriority = attribute.OrderPriority,
                    ProductAttributeValues = attribute.Values.Select(v => new ProductAttributeValue
                    {
                        Value = v.Value,
                        OrderPriority = v.OrderPriority,
                        ImageUrl = v.ImageUrl,
                    }).ToList(),
                });
            }
        }

        // Remove attributes that are not in the new list
        var attributesToRemove = product.Attributes.Where(a => !request.New.Attributes.Any(na => na.AttributeId == a.AttributeId)).ToList();
        foreach (var attribute in attributesToRemove)
        {
            product.Attributes.Remove(attribute);
        }

        // Update variants
        //TODO: optimize this part, it is not efficient
        // set isDeleted = true for all variants 
        foreach (var variant in product.Variants)
        {
            if (variant.IsDeleted == false)
            {
                variant.IsDeleted = true;
            }
        }
        // add new variants
        foreach (var variant in request.New.Variants)
        {
            var existingVariant = product.Variants.FirstOrDefault(v => variant.IsSameId(v));
            if (existingVariant != null)
            {
                existingVariant.Price = variant.Price;
                existingVariant.Sku = variant.Sku;
                existingVariant.IsDeleted = false;

            }
            else
            {
                product.Variants.Add(new Variant
                {
                    Sku = variant.Sku,
                    Price = variant.Price,
                    VariantAttributes = [.. variant.VariantAttributes.Select(va => new VariantAttribute
                    {
                        AttributeId = va.AttributeId,
                        Value = va.Value,
                    })],
                    Metric = new VariantMetric()
                });

            }
            if (product.Metric.LowestPrice > variant.Price)
            {
                product.Metric.LowestPrice = variant.Price;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return product.Slug;
    }
}

public static class VariantDtoExtensions
{
    public static bool IsSameId(this VariantDto variant, Variant other)
    {
        if (variant.VariantAttributes.Count != other.VariantAttributes.Count)
        {
            return false;
        }
        if (variant.ProductId != other.ProductId)
        {
            return false;
        }
        foreach (var attribute in variant.VariantAttributes)
        {
            var otherAttribute = other.VariantAttributes.FirstOrDefault(a => a.AttributeId == attribute.AttributeId);
            if (otherAttribute == null || otherAttribute.Value != attribute.Value)
            {
                return false;
            }
        }

        return true;
    }
}