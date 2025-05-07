using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Identity.Core.Application.Interfaces;
using Identity.Core.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Identity.Infrastructure.Jwt
{
    public class JwtService : ITokenService
    {
        private readonly JwtOptions _options;

        public JwtService(IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }

        public string GenerateAccessToken(User user, string refreshTokenId = "")
        {
            //TODO: get token lifetime base on user role from db
            return GenerateToken(user, DateTime.UtcNow.AddHours(1), refreshTokenId ?? "");
        }

        public string GenerateRefreshToken(User user)
        {

            //TODO: get token lifetime base on user role from db
            return GenerateToken(user, DateTime.UtcNow.AddDays(7));
        }

        public string GenerateToken(User user, DateTime? expires = null, string refreshTokenId = "")
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_options.Secret);

            var claims = new List<System.Security.Claims.Claim>()
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Name, user.Name),
                new(ClaimTypes.Role, user.Role),
                new("refreshTokenId", refreshTokenId), // use for checking refresh token validation. just need to store invalid access token
            };



            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _options.Issuer,
                Audience = _options.Audience
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string RefreshToken(string refreshToken)
        {
            throw new NotImplementedException();
        }

        Task<int> ITokenService.InvalidateToken(string accessToken, string? refreshToken)
        {
            return Task.FromResult(1);
        }

        Task<bool> ITokenService.VerifyAccessToken(string token)
        {
            // TODO: check invalidate list

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_options.Secret);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _options.Issuer,
                    ValidAudience = _options.Audience,
                }, out SecurityToken validatedToken);

                return Task.FromResult(validatedToken != null);
            }
            catch (Exception)
            {
                return Task.FromResult(false);
            }
        }
    }
}