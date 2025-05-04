using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Purchase.Core.Abstraction;

namespace Purchase.Infrastructure.Data;

public class ApplicationDbContext : DbContextAbstract
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}

