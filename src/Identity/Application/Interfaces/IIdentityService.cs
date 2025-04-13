using Domain.Entities;

namespace Application.Interfaces;


public interface IIdentityService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken(User user);
    string GetUserIdFromToken(string token);
    string GetRolesFromToken(string token);
    string RefreshToken(string refreshToken);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}