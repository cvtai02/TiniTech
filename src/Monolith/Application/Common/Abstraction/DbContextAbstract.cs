using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Abstraction;

public abstract class DbContextAbstract : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductAttribute> ProductAttributes { get; set; }
    public DbSet<ProductAttributeValue> ProductAttributeValues { get; set; }
    public DbSet<ProductMetric> ProductMetrics { get; set; }
    public DbSet<Variant> Variants { get; set; }
    public DbSet<VariantMetric> VariantMetrics { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<VariantAttribute> VariantAttributes { get; set; }
    public DbSet<AttributeEntity> AttributeEntities { get; set; }
    protected DbContextAbstract(DbContextOptions options) : base(options)
    {
    }

}
