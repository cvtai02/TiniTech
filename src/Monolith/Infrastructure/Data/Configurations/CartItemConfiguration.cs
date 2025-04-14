using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.Property(ci => ci.Quantity)
            .IsRequired()
            .HasDefaultValue(1);

        builder.HasIndex(ci => ci.UserId)
            .IsUnique()
            .HasDatabaseName("IX_CartItem_UserId");
    }
}
