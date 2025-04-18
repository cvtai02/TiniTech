using Application.Common.Exceptions;
using Application.Common.Abstraction;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Enums;

namespace Application.Categories.Commands;

public class DeleteCategoryCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
}

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;

    public DeleteCategoryCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.FindAsync(request.Id);

        if (category == null)
        {
            return new KeyNotFoundException($"Category with ID {request.Id} not found.");
        }

        // Check if category has subcategories
        var hasSubcategories = await _context.Categories
            .AnyAsync(c => c.ParentId == request.Id && c.Status != CategoryStatus.Deleted, cancellationToken);

        if (hasSubcategories)
        {
            return new RestrictDeleteException("Cannot delete category that has subcategories which are not deleted");
        }

        // Check if category is used by any products
        var isUsedByProducts = await _context.Products
            .AnyAsync(p => p.CategoryId == request.Id && p.Status != ProductStatus.Deleted, cancellationToken);

        if (isUsedByProducts)
        {
            return new RestrictDeleteException("Cannot delete category that is used by products which are not deleted");
        }

        category.Status = CategoryStatus.Deleted;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
