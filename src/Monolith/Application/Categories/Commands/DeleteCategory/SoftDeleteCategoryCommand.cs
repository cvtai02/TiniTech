using Application.Common.Exceptions;
using Application.Common.Abstraction;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Enums;

namespace Application.Categories.Commands;

public class SoftDeleteCategoryCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
}

public class SoftDeleteCategoryCommandHandler : IRequestHandler<SoftDeleteCategoryCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;

    public SoftDeleteCategoryCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(SoftDeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.Include(c => c.Subcategories).Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
        {
            return new KeyNotFoundException($"Category {request.Id} not found.");
        }

        // Check if category has subcategories
        if (category.Subcategories.Any(x => x.Status != CategoryStatus.Deleted))
        {
            return new RestrictDeleteException("Cannot delete category that has subcategories which are not deleted");
        }

        // Check if category is used by any products
        if (category.Products.Any(x => x.Status != ProductStatus.Deleted))
        {
            return new RestrictDeleteException("Cannot delete category that is used by products which are not deleted");
        }

        category.Status = CategoryStatus.Deleted;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
