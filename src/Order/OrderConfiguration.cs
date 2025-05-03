using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.OwnsOne(b => b.BillingAddress);

        builder.Property(e => e.ItemsPrice)
            .HasPrecision(18, 2);
        builder.Property(e => e.ShippingPrice)
            .HasPrecision(18, 2);

        builder.Property(e => e.TotalCost)
            .HasPrecision(18, 2);

        builder.Property(e => e.Discount)
            .HasPrecision(18, 2);
    }

}

public class Order
{
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.Property(e => e.UnitPrice)
            .HasPrecision(18, 2);

    }
}