using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Application.Common;
using Application.Interfaces;
using Application.Users.Commands.CreateUser;
using Domain.Constants;
using MediatR;

namespace Application.Auth.Commands.Register;

public class RegisterCommand : IRequest<Result<Guid>>
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<Guid>>
{
    private ISender _sender;
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(ISender sender, IIdentityService identityService)
    {
        _sender = sender;
        _identityService = identityService;
    }


    public Task<Result<Guid>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var hash = _identityService.HashPassword(request.Password);

        var user = new CreateUserCommand
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            ImageUrl = request.ImageUrl,
            Hash = hash,
            Role = request.Role
        };
        return _sender.Send(user, cancellationToken);
    }

}