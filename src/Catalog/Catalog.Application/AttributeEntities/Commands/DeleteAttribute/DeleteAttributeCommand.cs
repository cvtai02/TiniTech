using MediatR;
using Microsoft.EntityFrameworkCore;
using Catalog.Application.Common.Abstraction;
using Catalog.Application.Common.Exceptions;
using CrossCutting.Exceptions;

namespace Catalog.Application.AttributeEntities.Commands.DeleteAttribute;

public class DeleteAttributeCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
}

public class DeleteAttributeCommandHandler : IRequestHandler<DeleteAttributeCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;

    public DeleteAttributeCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteAttributeCommand request, CancellationToken cancellationToken)
    {
        var attribute = await _context.AttributeEntities.FindAsync(request.Id);

        if (attribute == null)
        {
            return new NotFoundException($"Attribute with ID {request.Id} not found.");
        }

        // Check if attribute is used by any product attributes
        var isUsedByProducts = await _context.ProductAttributes
            .AnyAsync(pa => pa.AttributeId == request.Id, cancellationToken);

        if (isUsedByProducts)
        {
            return new RestrictDeleteException("Cannot delete attribute that is used by products");
        }

        _context.AttributeEntities.Remove(attribute);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
