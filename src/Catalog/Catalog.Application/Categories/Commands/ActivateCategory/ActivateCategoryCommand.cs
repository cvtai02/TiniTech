using Catalog.Application.Common.Abstraction;
using Catalog.Application.Common.Exceptions;
using CrossCutting.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Application.Categories.Commands.ActivateCategory;

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
            return new NotFoundException($"Category {request.Id} not found.");
        }

        if (category.Status == CategoryStatus.Active)
        {
            return new NoActionException($"Category {request.Id} is already active.");
        }
        // Activate the category
        category.Status = CategoryStatus.Active;
        if (category.Parent != null && category.Parent.Status != CategoryStatus.Active)
        {
            category.Parent.Status = CategoryStatus.Active;
        }
        await _context.SaveChangesAsync(cancellationToken);

        return true;

    }
}
