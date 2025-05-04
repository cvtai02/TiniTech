using Microsoft.EntityFrameworkCore;
using Purchase.Core.Entities;

namespace Purchase.Core.Abstraction;

public abstract class DbContextAbstract : DbContext
{
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Shipping> Shippings { get; set; }
    public DbSet<ShippingProvider> ShippingProviders { get; set; }
    public DbSet<UserAddress> UserAddresses { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<StockItem> StockItems { get; set; }
    protected DbContextAbstract(DbContextOptions options) : base(options)
    {
    }

}
