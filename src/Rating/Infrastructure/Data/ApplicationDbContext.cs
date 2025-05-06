using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Rating.Core.Interfaces;

namespace Rating.Infrastructure.Data;


public class ApplicationDbContext : DbContextAbstract
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
