using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity.Core.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using SharedKernel.Extensions;
using WebSharedModels.Dtos.Identity;

namespace Identity.Core.Application.Users.Queries.GetUsers;

public class GetUsersQuery : IRequest<PaginatedList<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; } = null;
    public bool? IsActive { get; set; } = null;
}

public class GetUsersHandler : IRequestHandler<GetUsersQuery, PaginatedList<UserDto>>
{
    private readonly DbContextAbstract _context;
    public GetUsersHandler(DbContextAbstract context)
    {
        _context = context;
    }
    public async Task<PaginatedList<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(u => u.Name.Contains(request.Search) || u.Email.Contains(request.Search));
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(u => u.IsActive == request.IsActive.Value);
        }

        var toDtoQuery = query.Select(
            u => new UserDto
            {
                Id = u.Id.ToString(),
                Name = u.Name,
                Email = u.Email,
                Phone = u.Phone,
                ImageUrl = u.ImageUrl,
                Locked = u.Locked,
                Role = u.Role
            });

        return await toDtoQuery.ToPaginatedListAsync(request.Page, request.PageSize, cancellationToken);
    }
}
