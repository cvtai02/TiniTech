using Identity.Core.Application.Common.Exceptions;
using Identity.Core.Application.Interfaces;
using Identity.Core.Application.Users.Commands.CreateUser;
using Identity.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace Identity.Tests.Unit.Application.Users.Commands
{
    public class CreateUserCommandHandlerTests
    {
        [Fact]
        public async Task Handle_WithNewEmail_ShouldCreateUser()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<TestDbContext>()
                .UseInMemoryDatabase(databaseName: $"UserDb_{Guid.NewGuid()}")
                .Options;

            using var context = new TestDbContext(options);
            var handler = new CreateUserCommandHandler(context);

            var command = new CreateUserCommand
            {
                Email = "test@example.com",
                Name = "Test User",
                Hash = "hashed_password",
                Phone = "1234567890",
                ImageUrl = "http://example.com/image.jpg",
                Roles = new List<string> { "User" }
            };

            // Add a role that matches the requested role
            context.Roles.Add(new Role { Name = "User" });
            await context.SaveChangesAsync();

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == command.Email);
            Assert.NotNull(user);
            Assert.Equal(command.Name, user.Name);
            Assert.Equal(command.Hash, user.Hash);
            Assert.Equal(command.Phone, user.Phone);
            Assert.Equal(command.ImageUrl, user.ImageUrl);
            Assert.Contains(user.Roles, r => r.Name == "User");
        }

        [Fact]
        public async Task Handle_WithExistingEmail_ShouldReturnError()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<TestDbContext>()
                .UseInMemoryDatabase(databaseName: $"UserDb_{Guid.NewGuid()}")
                .Options;

            using var context = new TestDbContext(options);
            var handler = new CreateUserCommandHandler(context);

            // Add existing user
            var existingUser = new User
            {
                Email = "existing@example.com",
                Name = "Existing User",
                Hash = "hashed_password",
                Phone = "1234567890",
                ImageUrl = "http://example.com/image.jpg"
            };
            context.Users.Add(existingUser);
            await context.SaveChangesAsync();

            var command = new CreateUserCommand
            {
                Email = "existing@example.com",
                Name = "Test User",
                Hash = "hashed_password",
                Phone = "1234567890",
                ImageUrl = "http://example.com/image.jpg",
                Roles = new List<string> { "User" }
            };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.IsType<EmailExistedException>(result.Error);
        }

        [Fact]
        public async Task Handle_WithNewRole_ShouldCreateRoleAndUser()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<TestDbContext>()
                .UseInMemoryDatabase(databaseName: $"UserDb_{Guid.NewGuid()}")
                .Options;

            using var context = new TestDbContext(options);
            var handler = new CreateUserCommandHandler(context);

            var command = new CreateUserCommand
            {
                Email = "test@example.com",
                Name = "Test User",
                Hash = "hashed_password",
                Phone = "1234567890",
                ImageUrl = "http://example.com/image.jpg",
                Roles = new List<string> { "NewRole" }
            };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == "NewRole");
            Assert.NotNull(role);

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == command.Email);
            Assert.NotNull(user);
            Assert.Contains(user.Roles, r => r.Name == "NewRole");
        }

        // Helper TestDbContext for in-memory testing
        private class TestDbContext : DbContextAbtract
        {
            public TestDbContext(DbContextOptions options) : base(options) { }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<User>()
                    .HasMany(u => u.Roles)
                    .WithMany(r => r.Users);

                modelBuilder.Entity<Role>()
                    .HasMany(r => r.Claims)
                    .WithMany(c => c.Roles);

                modelBuilder.Entity<User>()
                    .HasMany(u => u.Claims)
                    .WithMany(c => c.Users);
            }
        }
    }
}
