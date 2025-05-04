using Microsoft.EntityFrameworkCore;
using Purchase.Core.Entities;

namespace Purchase.Infrastructure.Data.Configurations;

public class ShippingConfiguration : IEntityTypeConfiguration<Shipping>
{
    public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Shipping> builder)
    {
        builder.OwnsOne(b => b.From);
        builder.OwnsOne(b => b.To);
    }
}
