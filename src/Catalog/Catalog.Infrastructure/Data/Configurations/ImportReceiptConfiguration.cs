using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.Infrastructure.Data.Configurations;

public class ImportReceiptConfiguration : IEntityTypeConfiguration<ImportReceipt>
{
    public void Configure(EntityTypeBuilder<ImportReceipt> builder)
    {
        builder.HasKey(e => e.Id);
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
