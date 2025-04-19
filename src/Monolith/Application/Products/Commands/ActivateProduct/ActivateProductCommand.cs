using Application.Common.Abstraction;
using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Products.Commands.ActivateProductCommand;


public class ActivateProductCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
    public int CategoryId { get; set; } = 0;
}

public class ActivateProductCommandHandler : IRequestHandler<ActivateProductCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;

    public ActivateProductCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    /// <summary>
    /// Activates a product and its parent category if applicable.
    /// </summary>
    public async Task<Result<bool>> Handle(ActivateProductCommand request, CancellationToken cancellationToken)
    {

        var category = await _context.Categories.Include(c => c.Parent).FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
        {
            return new KeyNotFoundException($"Category {request.Id} not found.");
        }

        if (category.Status == CategoryStatus.Active)
        {
        }
        else
        {
            if (category.Parent != null && category.Parent.Status != Domain.Enums.CategoryStatus.Active)
            {
                category.Parent.Status = CategoryStatus.Active;
            }
            category.Status = CategoryStatus.Active;
        }

        var product = new Product
        {
            Id = request.Id,
        };

        _context.Products.Attach(product);
        product.Status = ProductStatus.Active;

        _context.Entry(product).Property(u => u.Status).IsModified = true;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}