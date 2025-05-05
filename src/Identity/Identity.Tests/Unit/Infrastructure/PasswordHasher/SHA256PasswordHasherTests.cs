using Identity.Infrastructure.PasswordHasher;
using Xunit;

namespace Identity.Tests.Unit.Infrastructure.PasswordHasher
{
    public class SHA256PasswordHasherTests
    {
        private readonly SHA256PasswordHasher _hasher;

        public SHA256PasswordHasherTests()
        {
            _hasher = new SHA256PasswordHasher();
        }

        [Fact]
        public void HashPassword_ShouldProduceConsistentHash()
        {
            // Arrange
            var password = "TestPassword123!";

            // Act
            var hash1 = _hasher.HashPassword(password);
            var hash2 = _hasher.HashPassword(password);

            // Assert
            Assert.NotNull(hash1);
            Assert.NotEmpty(hash1);
            Assert.Equal(hash1, hash2); // Hash should be consistent for the same password
        }

        [Fact]
        public void HashPassword_DifferentPasswords_ShouldProduceDifferentHashes()
        {
            // Arrange
            var password1 = "TestPassword123!";
            var password2 = "DifferentPassword456!";

            // Act
            var hash1 = _hasher.HashPassword(password1);
            var hash2 = _hasher.HashPassword(password2);

            // Assert
            Assert.NotEqual(hash1, hash2); // Different passwords should produce different hashes
        }

        [Fact]
        public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
        {
            // Arrange
            var password = "TestPassword123!";
            var hash = _hasher.HashPassword(password);

            // Act
            var result = _hasher.VerifyPassword(password, hash);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void VerifyPassword_WithIncorrectPassword_ShouldReturnFalse()
        {
            // Arrange
            var correctPassword = "TestPassword123!";
            var incorrectPassword = "WrongPassword456!";
            var hash = _hasher.HashPassword(correctPassword);

            // Act
            var result = _hasher.VerifyPassword(incorrectPassword, hash);

            // Assert
            Assert.False(result);
        }
    }
}
