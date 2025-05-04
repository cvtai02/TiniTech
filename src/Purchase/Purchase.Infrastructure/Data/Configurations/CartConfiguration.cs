using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Purchase.Core.Entities;

namespace Purchase.Infrastructure.Data.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<CartItem>
{

    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.HasOne(b => b.StockItem)
            .WithMany()
            .HasForeignKey(b => new { b.ProductId, b.VariantId });
    }
}
