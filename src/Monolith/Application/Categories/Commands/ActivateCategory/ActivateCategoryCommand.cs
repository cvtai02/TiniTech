using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using Application.Common.Exceptions;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Categories.Commands.ActivateCategory;

public class ActivateCategoryCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
}

public class ActivateCategoryCommandHandler : IRequestHandler<ActivateCategoryCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;

    public ActivateCategoryCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(ActivateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.Include(c => c.Parent).FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
        {
            return new KeyNotFoundException($"Category {request.Id} not found.");
        }

        if (category.Status == Domain.Enums.CategoryStatus.Active)
        {
            return new NoActionException($"Category {request.Id} is already active.");
        }
        // Activate the category
        category.Status = Domain.Enums.CategoryStatus.Active;
        if (category.Parent != null && category.Parent.Status != Domain.Enums.CategoryStatus.Active)
        {
            category.Parent.Status = Domain.Enums.CategoryStatus.Active;
        }
        await _context.SaveChangesAsync(cancellationToken);

        return true;

    }
}
