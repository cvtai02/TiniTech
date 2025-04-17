using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class VariantConfiguration : IEntityTypeConfiguration<Variant>
{
    public void Configure(EntityTypeBuilder<Variant> builder)
    {
        builder.Property(v => v.SKU)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasMany(v => v.VariantAttributes)
            .WithOne(va => va.Variant)
            .HasForeignKey(va => va.VariantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
