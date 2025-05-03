using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Application.Common.Abstraction;

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
    public DbSet<VariantAttribute> VariantAttributes { get; set; }
    public DbSet<AttributeEntity> AttributeEntities { get; set; }
    public DbSet<ImportReceipt> ImportReceipts { get; set; }
    public DbSet<ImportReceiptItem> ImportReceiptItems { get; set; }

    // public DbSet<Domain.Entities.Order> Orders { get; set; }
    // public DbSet<OrderItem> OrderItems { get; set; }
    // public DbSet<Shipping> Shippings { get; set; }
    // public DbSet<ShippingProvider> ShippingProviders { get; set; }
    // public DbSet<UserAddress> UserAddresses { get; set; }
    // public DbSet<CartItem> CartItems { get; set; }

    protected DbContextAbstract(DbContextOptions options) : base(options)
    {
    }

}
