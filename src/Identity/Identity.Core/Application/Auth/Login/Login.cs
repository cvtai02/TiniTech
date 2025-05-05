using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity.Core.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Identity;

namespace Identity.Core.Application.Auth.Queries.Login;

public class LoginQuery : LoginForm, IRequest<Result<AuthTokenDto>>
{
    public LoginQuery(LoginForm form)
    {
        Email = form.Email;
        Password = form.Password;
    }
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, Result<AuthTokenDto>>
{
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly DbContextAbtract _context;

    public LoginQueryHandler(ITokenService tokenService, DbContextAbtract context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthTokenDto>> Handle(LoginQuery request, CancellationToken cancellationToken)
    {

        var user = await _context.Users.FirstAsync(x => x.Email == request.Email, cancellationToken: cancellationToken);
        if (user == null)
        {
            return new Exception("User not found.");
        }
        var isValidPassword = _passwordHasher.VerifyPassword(request.Password, user.Hash);
        if (!isValidPassword)
        {
            return new Exception("Invalid password.");
        }

        return new AuthTokenDto
        {
            IsAuthenticated = true,
            AccessTokenExpiresTime = DateTime.UtcNow.AddMinutes(30),
            RefreshToken = _tokenService.GenerateRefreshToken(user)
        };

    }
}