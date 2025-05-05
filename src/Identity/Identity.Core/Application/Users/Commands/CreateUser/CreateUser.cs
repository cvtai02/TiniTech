using Identity.Core.Application.Common.Exceptions;
using Identity.Core.Application.Interfaces;
using Identity.Core.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Identity.Core.Application.Users.Commands.CreateUser;

public class CreateUserCommand : IRequest<Result<int>>
{
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Hash { get; set; } = "";
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = [];
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<int>>
{
    private readonly DbContextAbstract _context;
    public CreateUserCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }
    public async Task<Result<int>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {

        var roles = await _context.Roles
            .Where(r => request.Roles.Contains(r.Name))
            .ToListAsync(cancellationToken);

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (existingUser != null)
        {
            return new EmailExistedException($"User with email {request.Email} already exists.");
        }

        if (roles.Count != request.Roles.Count)
        {
            // add role not to list
            var missingRoles = request.Roles.Except(roles.Select(r => r.Name)).ToList();
            roles.AddRange(missingRoles.Select(r => new Role
            {
                Name = r,
            }));
        }

        var user = new User
        {
            Email = request.Email,
            Hash = request.Hash,
            Name = request.Name,
            ImageUrl = request.ImageUrl,
            Phone = request.Phone,
            Roles = roles,
        };

        if (string.IsNullOrEmpty(user.ImageUrl))
        {
            user.ImageUrl = "https://avatar.iran.liara.run/username?username=" + user.Name;
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user.Id;
    }
}
