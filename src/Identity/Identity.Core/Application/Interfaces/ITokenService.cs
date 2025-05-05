using Identity.Core.Domain.Entities;

namespace Identity.Core.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken(User user);
    string RefreshToken(string refreshToken);
    Task<int> InvalidateToken(string accessToken, string? refreshToken = null);
    Task<bool> VerifyAccessToken(string token);
}