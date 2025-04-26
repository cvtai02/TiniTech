using Application.Common.Abstraction;
using Application.Common.Exceptions;
using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Products.Commands.CreateProductCommand;

/// <summary>
/// Command to create a new product.
/// Images[0] will be the main image.
/// AttributeIds[0] will be the main attribute.
/// If attributeIds[0] == -1, then there is no main attribute.
/// </summary>
public class CreateProductCommand : IRequest<Result<string>>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string Sku { get; set; } = null!;
    public int? Price { get; set; }
    public int CategoryId { get; set; }
    public List<IFormFile>? Images { get; set; } = [];
}

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<string>>
{
    private readonly DbContextAbstract _context;
    private readonly IImageService _imageService;

    public CreateProductCommandHandler(DbContextAbstract context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<Result<string>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {

        var product = new Product
        {
            Name = request.Name,
            Sku = request.Sku,
            Description = request.Description ?? string.Empty,
            Status = ProductStatus.Draft,
            CategoryId = request.CategoryId,
            Metric = new ProductMetric
            {
                LowestPrice = request.Price ?? 0,
            },
        };


        var uploadTasks = request.Images?.Select(async (image, index) =>
        {
            var imageUrl = await _imageService.UploadImageAsync(image, "catalog/product", $"{product.Slug}_{index}");
            return new ProductImage
            {
                OrderPriority = index,
                ImageUrl = imageUrl
            };
        });

        if (uploadTasks == null || !uploadTasks.Any())
        {

        }
        else
        {
            try
            {
                var uploadedImages = await Task.WhenAll(uploadTasks);

                if (uploadedImages.Length == 0)
                {
                    return new InfrastructureException("No images were uploaded successfully.");
                }
                product.Images.AddRange(uploadedImages);
                product.ImageUrl = uploadedImages.First().ImageUrl;
            }
            catch (Exception ex)
            {
                return new InfrastructureException("Error uploading images.", ex);
            }
            // Set the first image as the main image
        }


        _context.Products.Add(product);

        await _context.SaveChangesAsync(cancellationToken);
        return product.Slug;
    }
}