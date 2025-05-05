using Identity.Core.Application.Auth.Commands.Register;
using Identity.Core.Application.Interfaces;
using Identity.Core.Application.Users.Commands.CreateUser;
using MediatR;
using Moq;
using SharedKernel.Models;
using WebSharedModels.Dtos.Identity;
using Xunit;

namespace Identity.Tests.Unit.Application.Auth.Commands
{
    public class RegisterCommandHandlerTests
    {
        private readonly Mock<ISender> _senderMock;
        private readonly Mock<IPasswordHasher> _passwordHasherMock;
        private readonly RegisterCommandHandler _handler;

        public RegisterCommandHandlerTests()
        {
            _senderMock = new Mock<ISender>();
            _passwordHasherMock = new Mock<IPasswordHasher>();
            _handler = new RegisterCommandHandler(_senderMock.Object, _passwordHasherMock.Object);
        }

        [Fact]
        public async Task Handle_ValidRequest_ShouldCreateUser()
        {
            // Arrange
            var registerForm = new RegisterForm
            {
                Name = "Test User",
                Email = "test@example.com",
                Phone = "1234567890",
                Password = "Password123!",
                ConfirmPassword = "Password123!"
            };

            var command = new RegisterCommand(registerForm);

            var hashedPassword = "hashed_password";
            _passwordHasherMock.Setup(x => x.HashPassword(command.Password))
                .Returns(hashedPassword);

            var userId = 42;
            _senderMock.Setup(x => x.Send(It.IsAny<CreateUserCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result<int>.Success(userId));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(userId, result.Value);

            _passwordHasherMock.Verify(x => x.HashPassword(command.Password), Times.Once);
            _senderMock.Verify(x => x.Send(It.Is<CreateUserCommand>(cmd =>
                cmd.Email == command.Email &&
                cmd.Name == command.Name &&
                cmd.Phone == command.Phone &&
                cmd.Hash == hashedPassword &&
                cmd.Roles.Contains(RoleList.User)),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task Handle_UserCreationFails_ShouldReturnFailure()
        {
            // Arrange
            var registerForm = new RegisterForm
            {
                Name = "Test User",
                Email = "test@example.com",
                Password = "Password123!",
                ConfirmPassword = "Password123!"
            };

            var command = new RegisterCommand(registerForm);

            var hashedPassword = "hashed_password";
            _passwordHasherMock.Setup(x => x.HashPassword(command.Password))
                .Returns(hashedPassword);

            var error = new Exception("User creation failed");
            _senderMock.Setup(x => x.Send(It.IsAny<CreateUserCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result<int>.Failure(error));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Same(error, result.Error);
        }
    }
}
