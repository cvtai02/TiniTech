using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries.GetUserByEmail;

public class GetUserByEmailCommand : IRequest<UserResponse>
{
    public string Email { get; set; } = string.Empty;
}

public class GetUserByEmailCommandHandler : IRequestHandler<GetUserByEmailCommand, UserResponse>
{

    private readonly IApplicationDbContext _context;

    public GetUserByEmailCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserResponse> Handle(GetUserByEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstAsync(x => x.Email == request.Email, cancellationToken: cancellationToken);

        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            ImageUrl = user.ImageUrl,
            Role = user.Role
        };
    }
}