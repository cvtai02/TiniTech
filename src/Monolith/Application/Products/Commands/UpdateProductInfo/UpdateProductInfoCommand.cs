using Application.Common.Abstraction;
using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Products.Commands.UpdateProductInfo;

public class UpdateProductInfoCommand : IRequest<Result<int>>
{
    public int ProductId { get; set; }
    public string? Name { get; set; }
    public string? Sku { get; set; }
    public int? Price { get; set; }
    public int? CategoryId { get; set; }
    public string? Description { get; set; }
    public ProductStatus? Status { get; set; }

    public CrudVariantDto? Variants { get; set; }
    public CrudProductAttributeDto? Attributes { get; set; }


}

public class UpdateProductInfoCommandHandler : IRequestHandler<UpdateProductInfoCommand, Result<int>>
{
    private readonly DbContextAbstract _context;

    public UpdateProductInfoCommandHandler(DbContextAbstract dbContext)
    {
        _context = dbContext;
    }

    public async Task<Result<int>> Handle(UpdateProductInfoCommand request, CancellationToken cancellationToken)
    {
        // Find the product by id
        var product = await _context.Products
            .Include(p => p.Metric)
            .Include(p => p.Variants)
            .Include(p => p.Attributes)
                .ThenInclude(p => p.ProductAttributeValues)
            .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

        if (product == null)
        {
            return new KeyNotFoundException($"Product with ID {request.ProductId} not found.");
        }

        // Update product properties if they are provided
        if (request.Name != null)
            product.Name = request.Name;

        if (request.Sku != null)
            product.Sku = request.Sku;

        if (request.Price.HasValue)
            product.Metric.LowestPrice = request.Price.Value;

        if (request.CategoryId.HasValue)
            product.CategoryId = request.CategoryId.Value;

        if (request.Description != null)
            product.Description = request.Description;

        if (request.Status.HasValue)
            product.Status = request.Status.Value;

        // Add new variants

        if (request.Variants != null)
        {
            foreach (var variantDto in request.Variants.AddList)
            {
                var variant = new Variant
                {
                    ProductId = product.Id,
                    Price = variantDto.Price,
                    Sku = variantDto.SKU
                };

                foreach (var attributeDto in variantDto.Attributes)
                {
                    var variantAttribute = new VariantAttribute
                    {
                        AttributeId = attributeDto.AttributeId,
                        Value = attributeDto.Values
                    };

                    variant.VariantAttributes.Add(variantAttribute);
                }

                product.Variants.Add(variant);
            }


            // Update existing variants
            foreach (var variantDto in request.Variants.UpdateList)
            {
                var variant = product.Variants.Where(x => x.Id == variantDto.VariantsId).FirstOrDefault();

                if (variant != null)
                {
                    if (variantDto.Price.HasValue)
                        variant.Price = variantDto.Price.Value;

                    if (variantDto.SKU != null)
                        variant.Sku = variantDto.SKU;

                    if (variantDto.IsDeleted.HasValue && variantDto.IsDeleted.Value)
                        variant.IsDeleted = true;
                }
            }
        }

        // Handle product attributes if provided
        if (request.Attributes != null)
        {
            int x = 1;
            // Add new attributes
            foreach (var attributeDto in request.Attributes.AddList)
            {
                var productAttribute = product.Attributes.FirstOrDefault(pa => pa.AttributeId == attributeDto.AttributeId);
                if (productAttribute == null)
                {
                    productAttribute = new ProductAttribute
                    {
                        IsPrimary = attributeDto.IsPrimary,
                        AttributeId = attributeDto.AttributeId,
                        OrderPriority = attributeDto.OrderPriority ?? x++,
                    };

                    product.Attributes.Add(productAttribute);
                }
                else
                {
                    productAttribute.IsPrimary = attributeDto.IsPrimary;
                    productAttribute.OrderPriority = attributeDto.OrderPriority ?? x++;
                }


                foreach (var valueDto in attributeDto.Values)
                {
                    var attributeValue = new ProductAttributeValue
                    {
                        ProductAttributeId = productAttribute.Id,
                        Value = valueDto.Value,
                        OrderPriority = valueDto.OrderPriority ?? x++,
                        ImageUrl = valueDto.ImageUrl
                    };

                    productAttribute.ProductAttributeValues.Add(attributeValue);
                }
            }

            // Remove attribute values
            foreach (var removeDto in request.Attributes.RemoveList)
            {
                var productAttributes = await _context.ProductAttributes
                    .Where(pa => pa.ProductId == product.Id && pa.AttributeId == removeDto.AttributeId)
                    .ToListAsync(cancellationToken);

                foreach (var productAttribute in productAttributes)
                {
                    var attributeValues = await _context.ProductAttributeValues
                        .Where(av => av.ProductAttributeId == productAttribute.Id && removeDto.Values.Contains(av.Value))
                        .ToListAsync(cancellationToken);

                    if (attributeValues.Any())
                    {
                        _context.ProductAttributeValues.RemoveRange(attributeValues);
                    }
                }
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return product.Id;
    }
}


public class CrudVariantDto
{
    public List<CreateVariantDto> AddList { get; set; } = [];
    public List<UpdateVariantDto> UpdateList { get; set; } = [];
}

public class CreateVariantDto
{
    public int Price { get; set; }
    public string SKU { get; set; } = null!;
    public List<VariantAttributeDto> Attributes { get; set; } = [];
}

public class VariantAttributeDto
{
    public int AttributeId { get; set; }
    public string Values { get; set; } = null!;
}

public class UpdateVariantDto
{
    public int VariantsId { get; set; }
    public int? Price { get; set; }
    public string? SKU { get; set; }
    public bool? IsDeleted { get; set; }
}

public class CrudProductAttributeDto
{
    public List<CreateProductAttributeDto> AddList { get; set; } = [];
    public List<DeleteProductAttributeValueDto> RemoveList { get; set; } = [];
}

public class CreateProductAttributeDto
{
    public int AttributeId { get; set; }
    public bool IsPrimary { get; set; }
    public float? OrderPriority { get; set; }
    public List<AttributeValueDto> Values { get; set; } = [];
}

public class AttributeValueDto
{
    public string Value { get; set; } = null!;
    public float? OrderPriority { get; set; }
    public string? ImageUrl { get; set; }
}

public class DeleteProductAttributeValueDto
{
    public int AttributeId { get; set; }
    public List<string> Values { get; set; } = [];
}