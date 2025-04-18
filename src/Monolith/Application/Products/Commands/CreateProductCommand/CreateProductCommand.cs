using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Products.Commands.CreateProductCommand;

public class CreateProductCommand : IRequest<Result<int>>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public IFormFile Image { get; set; } = null!;
}


public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<int>>
{
    private readonly DbContextAbstract _context;
    private readonly IImageService _imageService;

    public CreateProductCommandHandler(DbContextAbstract context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<Result<int>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            CategoryId = request.CategoryId,
        };
        var imageUrl = await _imageService.UploadImageAsync(request.Image, "catalog/product", product.Slug);

        product.Images.Add(new ProductImage
        {
            // ProductSlug = product.Slug, // ef core will set this automatically 
            Priority = 1,
            ImageUrl = imageUrl
        });
        _context.Products.Add(product);
        try
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _imageService.RemoveImageAsync("catalog/product", imageUrl).Wait(cancellationToken);
            return ex;
        }

    }
}