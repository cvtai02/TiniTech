using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity.Core.Application.Common.Exceptions;
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

public class AuthTokenDto : LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, Result<AuthTokenDto>>
{
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly DbContextAbstract _context;

    public LoginQueryHandler(ITokenService tokenService, DbContextAbstract context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthTokenDto>> Handle(LoginQuery request, CancellationToken cancellationToken)
    {

        var user = await _context.Users
            .Include(x => x.Roles)
            .FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken: cancellationToken);
        if (user == null)
        {
            return new KeyNotFoundException("User not found.");
        }
        var isValidPassword = _passwordHasher.VerifyPassword(request.Password, user.Hash);
        Console.WriteLine($"isValidPassword: {isValidPassword}");
        if (!isValidPassword)
        {
            return new InvalidPasswordException("Invalid password.");
        }

        return new AuthTokenDto
        {
            IsAuthenticated = true,
            AccessTokenExpiresTime = DateTime.UtcNow.AddMinutes(60),
            RefreshTokenExpiresTime = DateTime.UtcNow.AddDays(7),
            RefreshToken = _tokenService.GenerateRefreshToken(user),
            AccessToken = _tokenService.GenerateAccessToken(user),
            Roles = [.. user.Roles.Select(x => x.Name)],
        };

    }
}