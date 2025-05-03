using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.Infrastructure.Data.Configurations;

public class ProductMetricConfiguration : IEntityTypeConfiguration<ProductMetric>
{
    public void Configure(EntityTypeBuilder<ProductMetric> builder)
    {
        builder.Property(p => p.RatingAvg)
            .HasColumnType("decimal(3, 2)")
            .HasDefaultValue(0.0f);

        builder.Property(p => p.LowestPrice)
            .HasColumnType("decimal(18, 2)")
            .HasDefaultValue(0.00m);

    }
}
