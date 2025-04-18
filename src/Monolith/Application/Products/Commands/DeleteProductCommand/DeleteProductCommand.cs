using Application.Common.Abstraction;
using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using MediatR;

namespace Application.Products.Commands.DeleteProductCommand;

public class DeleteProductCommand : IRequest<Result<bool>>
{
    public string Slug { get; set; } = null!;
}

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;
    private readonly IImageService _imageService;

    public DeleteProductCommandHandler(DbContextAbstract context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<Result<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Slug = request.Slug
        };

        _context.Products.Attach(product);
        product.Status = ProductStatus.Deleted;
        _context.Entry(product).Property(u => u.Status).IsModified = true;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
