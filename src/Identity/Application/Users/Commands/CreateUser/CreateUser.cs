using Application.Common;
using Application.Interfaces;
using MediatR;

namespace Application.Users.Commands.CreateUser;

public class CreateUserCommand : IRequest<Result<Guid>>
{
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Hash { get; set; } = "";
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    public CreateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<Result<Guid>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new Domain.Entities.User
        {
            Email = request.Email,
            Hash = request.Hash,
            Name = request.Name,
            ImageUrl = request.ImageUrl,
            Role = request.Role,
            Phone = request.Phone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            DeletedAt = null,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user.Id;
    }
}
