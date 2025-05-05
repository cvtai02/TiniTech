using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity.Core.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Identity;

namespace Identity.Core.Application.Users.Queries.GetUsers;

public class GetUsersQuery : IRequest<List<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; } = null;
    public bool? IsActive { get; set; } = null;
}

public class GetUsersHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly DbContextAbtract _context;
    public GetUsersHandler(DbContextAbtract context)
    {
        _context = context;
    }
    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
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

        var users = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return [.. users.Select(u => new UserDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            ImageUrl = u.ImageUrl,
            Locked = u.Locked,
            Roles = u.Roles.Select(r => r.Name).ToList()
        })];
    }
}
