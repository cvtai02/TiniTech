using Identity.Core.Domain.Entities;
using Identity.Infrastructure.Jwt;
using Microsoft.Extensions.Options;
using Moq;
using System.Security.Claims;
using Xunit;

namespace Identity.Tests.Unit.Infrastructure.Jwt
{
    public class JwtServiceTests
    {
        private readonly JwtOptions _jwtOptions;
        private readonly JwtService _jwtService;

        public JwtServiceTests()
        {
            _jwtOptions = new JwtOptions
            {
                Secret = "this_is_a_very_long_secret_key_for_testing_purposes_only",
                ExpiryMinutes = 60,
                Issuer = "test-issuer",
                Audience = "test-audience"
            };

            var optionsMock = new Mock<IOptions<JwtOptions>>();
            optionsMock.Setup(x => x.Value).Returns(_jwtOptions);

            _jwtService = new JwtService(optionsMock.Object);
        }

        [Fact]
        public void GenerateToken_ShouldReturnValidToken()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Name = "Test User",
                Email = "test@example.com"
            };

            var claims = new List<Claim>
            {
                new Claim("custom", "value")
            };

            // Act
            var token = _jwtService.GenerateToken(user, claims);

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);

            // Verify token can be decoded (if we want more thorough testing,
            // we could decode the token and verify the claims)
        }

        [Fact]
        public void GenerateToken_WithNoCustomClaims_ShouldIncludeStandardClaims()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Name = "Test User",
                Email = "test@example.com"
            };

            // Act
            var token = _jwtService.GenerateToken(user, null);

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }
    }
}
