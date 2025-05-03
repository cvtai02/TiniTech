using Catalog.Application.Common.Abstraction;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Attributes;

namespace Catalog.Application.AttributeEntities.Queries.GetAll;

public class GetAllAttributesQuery : IRequest<Result<List<AttributeDto>>>
{
}


public class GetAllAttributeQueryHandler : IRequestHandler<GetAllAttributesQuery, Result<List<AttributeDto>>>
{
    private readonly DbContextAbstract _context;

    public GetAllAttributeQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<List<AttributeDto>>> Handle(GetAllAttributesQuery request, CancellationToken cancellationToken)
    {
        var attributes = await _context.AttributeEntities
            .AsNoTracking()
            .Select(a => new AttributeDto
            {
                Id = a.Id,
                Name = a.Name,
            })
            .ToListAsync(cancellationToken);

        return attributes;
    }
}
