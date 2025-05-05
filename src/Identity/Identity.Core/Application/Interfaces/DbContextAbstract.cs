using Identity.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Identity.Core.Application.Interfaces;
public abstract class DbContextAbtract : DbContext
{
    protected DbContextAbtract(DbContextOptions options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Claim> Claims { get; set; }
    public DbSet<UserToken> RefreshTokens { get; set; }
    public DbSet<UserLogin> UserLogins { get; set; }
}