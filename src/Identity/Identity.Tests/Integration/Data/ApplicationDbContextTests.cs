using Identity.Core.Domain.Entities;
using Identity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Identity.Tests.Integration.Data
{
    public class ApplicationDbContextTests
    {
        [Fact]
        public async Task CanAddAndRetrieveUser()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"IdentityDb_{Guid.NewGuid()}")
                .Options;

            // Act - Add user
            using (var context = new ApplicationDbContext(options))
            {
                var user = new User
                {
                    Name = "Test User",
                    Email = "test@example.com",
                    Hash = "hashed_password",
                    Phone = "1234567890",
                    ImageUrl = "http://example.com/image.jpg"
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();
            }

            // Assert - Retrieve user
            using (var context = new ApplicationDbContext(options))
            {
                var user = await context.Users
                    .FirstOrDefaultAsync(u => u.Email == "test@example.com");

                Assert.NotNull(user);
                Assert.Equal("Test User", user.Name);
                Assert.Equal("hashed_password", user.Hash);
                Assert.Equal("1234567890", user.Phone);
                Assert.Equal("http://example.com/image.jpg", user.ImageUrl);
            }
        }

        [Fact]
        public async Task UserRoleRelationship_ShouldWorkCorrectly()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"IdentityDb_{Guid.NewGuid()}")
                .Options;

            // Create user and roles
            using (var context = new ApplicationDbContext(options))
            {
                var role1 = new Role { Name = "Admin" };
                var role2 = new Role { Name = "User" };
                context.Roles.AddRange(role1, role2);
                await context.SaveChangesAsync();

                var user = new User
                {
                    Name = "Test User",
                    Email = "test@example.com",
                    Hash = "hashed_password",
                    Phone = "1234567890",
                    ImageUrl = "http://example.com/image.jpg",
                    Roles = new List<Role> { role1, role2 }
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();
            }

            // Assert - Verify user has roles
            using (var context = new ApplicationDbContext(options))
            {
                var user = await context.Users
                    .Include(u => u.Roles)
                    .FirstOrDefaultAsync(u => u.Email == "test@example.com");

                Assert.NotNull(user);
                Assert.Equal(2, user.Roles.Count);
                Assert.Contains(user.Roles, r => r.Name == "Admin");
                Assert.Contains(user.Roles, r => r.Name == "User");
            }

            // Assert - Verify roles have user
            using (var context = new ApplicationDbContext(options))
            {
                var adminRole = await context.Roles
                    .Include(r => r.Users)
                    .FirstOrDefaultAsync(r => r.Name == "Admin");

                Assert.NotNull(adminRole);
                Assert.Single(adminRole.Users);
                Assert.Equal("Test User", adminRole.Users.First().Name);
            }
        }
    }
}
