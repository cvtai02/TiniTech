using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ProductMetricConfiguration : IEntityTypeConfiguration<ProductMetric>
{
    public void Configure(EntityTypeBuilder<ProductMetric> builder)
    {
        builder.Property(p => p.RatingAvg)
            .HasColumnType("decimal(3, 2)")
            .HasDefaultValue(0.0f);

    }
}
