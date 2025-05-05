using Identity.Core.Application.Interfaces;
using Identity.Core.Application.Users.Commands.CreateUser;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Identity.Tests.Unit.Application.Users.Commands
{
    public class CreateUserCommandValidatorTests
    {
        private readonly Mock<DbContextAbtract> _contextMock;
        private readonly CreateUserCommandValidator _validator;

        public CreateUserCommandValidatorTests()
        {
            _contextMock = new Mock<DbContextAbtract>(MockBehavior.Strict, new object[] { new DbContextOptions<DbContextAbtract>() });
            _validator = new CreateUserCommandValidator(_contextMock.Object);
        }

        [Theory]
        [InlineData("", false, "Name is required")]
        [InlineData("John Doe", true, null)]
        [InlineData("ThisNameIsTooLongThisNameIsTooLongThisNameIsTooLongThisNameIs", false, "must not exceed 50 characters")]
        public async Task ValidateName_ShouldValidateCorrectly(string name, bool isValid, string errorMessage)
        {
            // Arrange
            var command = new CreateUserCommand { Name = name };

            // Act
            var result = await _validator.ValidateAsync(command);

            // Assert
            Assert.Equal(isValid, !result.Errors.Any(e => e.PropertyName == nameof(command.Name)));
            if (!isValid)
            {
                Assert.Contains(errorMessage, result.Errors.First(e => e.PropertyName == nameof(command.Name)).ErrorMessage);
            }
        }

        [Theory]
        [InlineData("", false, "Email is required")]
        [InlineData("invalid-email", false, "Invalid email format")]
        [InlineData("valid@example.com", true, null)]
        public async Task ValidateEmail_ShouldValidateCorrectly(string email, bool isValid, string errorMessage)
        {
            // Arrange
            var command = new CreateUserCommand { Email = email };

            // Act
            var result = await _validator.ValidateAsync(command);

            // Assert
            Assert.Equal(isValid, !result.Errors.Any(e => e.PropertyName == nameof(command.Email)));
            if (!isValid)
            {
                Assert.Contains(errorMessage, result.Errors.First(e => e.PropertyName == nameof(command.Email)).ErrorMessage);
            }
        }
    }
}
