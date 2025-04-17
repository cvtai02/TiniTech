using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Categories.Commands;

public class DeleteCategoryCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
}

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteCategoryCommandHandler(IApplicationDbContext context)
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
            .AnyAsync(c => c.ParentId == request.Id, cancellationToken);

        if (hasSubcategories)
        {
            return new RestrictDeleteException("Cannot delete category that has subcategories");
        }

        // Check if category is used by any products
        var isUsedByProducts = await _context.Products
            .AnyAsync(p => p.CategoryId == request.Id, cancellationToken);

        if (isUsedByProducts)
        {
            return new RestrictDeleteException("Cannot delete category that is used by products");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
