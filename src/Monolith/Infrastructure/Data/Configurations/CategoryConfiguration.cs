using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;
public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.Property(e => e.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.HasOne(e => e.Parent)
            .WithMany(e => e.Subcategories)
            .HasForeignKey(e => e.ParentId)
            .OnDelete(DeleteBehavior.Restrict); // Prevents cascading delete to avoid deleting all subcategories when a parent is deleted

        builder.HasMany(e => e.Products)
            .WithMany(e => e.Category)
            .UsingEntity(j => j.ToTable("CategoryProducts"));

        builder.HasIndex(e => e.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Category_Slug");

    }
}