using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Purchase.Core.Entities;

namespace Purchase.Infrastructure.Data.Configurations;

public class StockItemConfiguration : IEntityTypeConfiguration<StockItem>
{
    public void Configure(EntityTypeBuilder<StockItem> builder)
    {
        // Don't map the Id field
        builder.Ignore(b => b.Id);

        // Composite primary key
        builder.HasKey(b => new { b.ProductId, b.VariantId });
    }

}
