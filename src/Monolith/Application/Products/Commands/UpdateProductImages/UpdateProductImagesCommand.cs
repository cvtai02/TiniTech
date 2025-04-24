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

namespace Application.Products.Commands.UpdateProductImages;

public class UpdateProductImagesCommand : IRequest<Result<int>>
{
    public int ProductId { get; set; }
    public List<IFormFile> AddImages { get; set; } = [];
    public List<float> AddImagesOrderPriority { get; set; } = [];
    public List<int> RemoveImageIds { get; set; } = [];
    public string? DefaultImageUrl { get; set; }
    public int? DefaultImageIndexInAdding { get; set; }
}


public class UpdateProductImagesCommandHandler : IRequestHandler<UpdateProductImagesCommand, Result<int>>
{
    private readonly DbContextAbstract _context;
    private readonly IImageService _imageService;

    public UpdateProductImagesCommandHandler(DbContextAbstract dbContext, IImageService imageService)
    {
        _imageService = imageService;
        _context = dbContext;
    }

    public async Task<Result<int>> Handle(UpdateProductImagesCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Id = request.ProductId,
            Images = []
        };
        _context.Products.Attach(product);

        var uploadTasks = request.AddImages?.Select(async (image, index) =>
         {
             var imageUrl = await _imageService.UploadImageAsync(image, "catalog/product", $"{index}");
             return new ProductImage
             {
                 OrderPriority = request.AddImagesOrderPriority[index],
                 ImageUrl = imageUrl
             };
         });

        if (uploadTasks == null || !uploadTasks.Any())
        {

        }
        else
        {
            var uploadedImages = await Task.WhenAll(uploadTasks);

            if (uploadedImages.Length == 0)
            {
                return new InfrastructureException("No images were uploaded successfully.");
            }
            product.Images.AddRange(uploadedImages);
        }
        if (request.DefaultImageUrl != null)
        {
            product.ImageUrl = request.DefaultImageUrl;
            _context.Entry(product).Property(x => x.ImageUrl).IsModified = true;

        }
        else if (request.DefaultImageIndexInAdding != null)
        {
            product.ImageUrl = product.Images[request.DefaultImageIndexInAdding.Value].ImageUrl;
            _context.Entry(product).Property(x => x.ImageUrl).IsModified = true;
        }

        var removeImages = request.RemoveImageIds.Select(x => new ProductImage { Id = x }).ToList();
        _context.ProductImages.AttachRange(removeImages);
        _context.Entry(product).Collection(x => x.Images).IsModified = true;
        foreach (var image in removeImages)
        {
            _context.Entry(image).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
        }

        await _context.SaveChangesAsync();
        return product.Id;
    }
}