using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using Application.Common.Exceptions;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Products.Commands.CreateProductCommand;

/// <summary>
/// Command to create a new product.
/// Images[0] will be the main image.
/// AttributeIds[0] will be the main attribute.
/// </summary>
public class CreateProductCommand : IRequest<Result<string>>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int Price { get; set; }
    public int CategoryId { get; set; }
    public List<IFormFile> Images { get; set; } = null!;
    public List<int> AttributeIds { get; set; } = null!;
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
            Description = request.Description,
            CategoryId = request.CategoryId,
            Attributes = [.. request.AttributeIds.Select((id, index) => new ProductAttribute
            {
                AttributeId = id,
                OrderPriority = index,
                IsPrimary = index == 0
            })],
            Metric = new ProductMetric
            {
                LowestPrice = request.Price,
            },
        };

        var uploadTasks = request.Images.Select(async (image, index) =>
        {
            var imageUrl = await _imageService.UploadImageAsync(image, "catalog/product", $"{product.Slug}_{index}");
            return new ProductImage
            {
                OrderPriority = index,
                ImageUrl = imageUrl
            };
        });

        var uploadedImages = await Task.WhenAll(uploadTasks);

        if (uploadedImages.Length == 0)
        {
            return new InfrastructureException("No images were uploaded successfully.");
        }
        product.Images.AddRange(uploadedImages);
        product.ImageUrl = uploadedImages.First().ImageUrl; // Set the first image as the main image

        _context.Products.Add(product);

        await _context.SaveChangesAsync(cancellationToken);
        return product.Slug;
    }
}