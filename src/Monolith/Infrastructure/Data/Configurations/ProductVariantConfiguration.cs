using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.Property(v => v.SKU)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasMany(v => v.VariantAttributes)
            .WithOne(va => va.ProductVariant)
            .HasForeignKey(va => va.ProductVariantId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(v => v.VariantPrimaryAttributes)
            .WithOne(vpa => vpa.ProductVariant)
            .HasForeignKey(vpa => vpa.ProductVariantId)
            .OnDelete(DeleteBehavior.Cascade);


    }
}
