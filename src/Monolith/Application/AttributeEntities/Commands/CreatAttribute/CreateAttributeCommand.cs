using Application.Common.Abstraction;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.AttributeEntities.Commands.CreatAttribute;

public class CreateAttributeCommand : IRequest<Result<int>>
{
    public string Name { get; set; } = string.Empty;
}

public class CreateAttributeCommandHandler : IRequestHandler<CreateAttributeCommand, Result<int>>
{
    private readonly DbContextAbstract _context;

    public CreateAttributeCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<int>> Handle(CreateAttributeCommand request, CancellationToken cancellationToken)
    {
        var entity = new AttributeEntity
        {
            Name = request.Name,
        };

        _context.AttributeEntities.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
