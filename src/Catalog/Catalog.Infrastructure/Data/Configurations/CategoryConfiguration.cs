using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.Infrastructure.Data.Configurations;
public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasIndex(e => e.Name)
            .IsUnique()
            .HasDatabaseName("IX_Category_Name");

        builder.HasOne(e => e.Parent)
            .WithMany(e => e.Subcategories)
            .HasForeignKey(e => e.ParentId)
            .OnDelete(DeleteBehavior.Restrict); // Prevents cascading delete to avoid deleting all subcategories when a parent is deleted

        builder.HasMany(e => e.Products)
            .WithOne(e => e.Category)
            .OnDelete(DeleteBehavior.Restrict); // Prevents cascading delete to avoid deleting all products when a category is deleted

        builder.HasIndex(e => e.Slug)
            .HasDatabaseName("IX_Category_Slug");

    }
}