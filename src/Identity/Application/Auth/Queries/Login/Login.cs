using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common;
using Application.Interfaces;
using Application.Users.Queries.GetUserByEmail;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Auth.Queries.Login;

public class LoginQuery : IRequest<Result<LoginResponse>>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, Result<LoginResponse>>
{
    private readonly IIdentityService _identityService;
    private readonly IApplicationDbContext _context;

    public LoginQueryHandler(IIdentityService identityService, IApplicationDbContext context)
    {
        _identityService = identityService;
        _context = context;
    }

    public async Task<Result<LoginResponse>> Handle(LoginQuery request, CancellationToken cancellationToken)
    {

        var user = await _context.Users.FirstAsync(x => x.Email == request.Email, cancellationToken: cancellationToken);
        if (user == null)
        {
            return new Exception("User not found.");
        }
        var isValidPassword = _identityService.VerifyPassword(request.Password, user.Hash);
        if (!isValidPassword)
        {
            return new Exception("Invalid password.");
        }

        return new LoginResponse
        {
            IsAuthenticated = true,
            AccessToken = _identityService.GenerateAccessToken(user),
            RefreshToken = _identityService.GenerateRefreshToken(user)
        };

    }
}