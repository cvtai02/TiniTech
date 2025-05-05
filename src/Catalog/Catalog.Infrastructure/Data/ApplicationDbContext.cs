using System.Reflection;
using Catalog.Application.Common.Abstraction;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Data;

public class ApplicationDbContext : DbContextAbstract
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}

