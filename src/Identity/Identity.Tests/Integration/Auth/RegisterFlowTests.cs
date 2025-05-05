using Identity.Core.Application.Auth.Commands.Register;
using Identity.Core.Application.Interfaces;
using Identity.Core.Domain.Entities;
using Identity.Infrastructure.Data;
using Identity.Infrastructure.PasswordHasher;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WebSharedModels.Dtos.Identity;
using Xunit;

namespace Identity.Tests.Integration.Auth
{
    public class RegisterFlowTests
    {
        [Fact]
        public async Task RegisterUser_EndToEnd_ShouldCreateUserInDatabase()
        {
            // Arrange
            var services = new ServiceCollection();

            // Setup in-memory database
            var dbName = $"IdentityDb_{Guid.NewGuid()}";
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase(dbName));

            services.AddScoped<DbContextAbtract, ApplicationDbContext>();
            services.AddScoped<IPasswordHasher, SHA256PasswordHasher>();

            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(RegisterCommand).Assembly);
            });

            var provider = services.BuildServiceProvider();

            // Get required services
            var mediator = provider.GetRequiredService<MediatR.IMediator>();

            // Create registration form
            var registerForm = new RegisterForm
            {
                Name = "Integration Test User",
                Email = "integration@example.com",
                Phone = "9876543210",
                Password = "SecurePassword123!",
                ConfirmPassword = "SecurePassword123!"
            };

            // Act
            var command = new RegisterCommand(registerForm);
            var result = await mediator.Send(command);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.True(result.Value > 0);

            // Verify user was created in database
            using var scope = provider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var createdUser = await context.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Email == registerForm.Email);

            Assert.NotNull(createdUser);
            Assert.Equal(registerForm.Name, createdUser.Name);
            Assert.Equal(registerForm.Phone, createdUser.Phone);
            Assert.Contains(createdUser.Roles, r => r.Name == RoleList.User);

            // Verify password was hashed
            Assert.NotEqual(registerForm.Password, createdUser.Hash);

            // Verify password verification works
            var passwordHasher = provider.GetRequiredService<IPasswordHasher>();
            Assert.True(passwordHasher.VerifyPassword(registerForm.Password, createdUser.Hash));
        }
    }
}
