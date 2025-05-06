
using Microsoft.EntityFrameworkCore;
using Rating.Core.Entities;

namespace Rating.Core.Interfaces;

public abstract class DbContextAbstract : DbContext
{
    public DbSet<UserRating> UserRatings { get; set; } = null!;

    public DbSet<ProductRatingSummary> ProductRatingSummaries { get; set; } = null!;

    protected DbContextAbstract(DbContextOptions options) : base(options)
    {
    }
}