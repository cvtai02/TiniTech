using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ImportReceiptConfiguration : IEntityTypeConfiguration<ImportReceipt>
{
    public void Configure(EntityTypeBuilder<ImportReceipt> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.TotalCost)
            .HasPrecision(18, 2);
    }
}

public class ImportReceiptItemsConfiguration : IEntityTypeConfiguration<ImportReceiptItem>
{
    public void Configure(EntityTypeBuilder<ImportReceiptItem> builder)
    {
        builder.Property(e => e.UnitCost)
            .HasPrecision(18, 2);
    }
}
