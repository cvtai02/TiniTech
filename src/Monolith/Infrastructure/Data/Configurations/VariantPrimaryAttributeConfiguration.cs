using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class VariantPrimaryAttributeConfiguration : IEntityTypeConfiguration<VariantPrimaryAttribute>
{
    public void Configure(EntityTypeBuilder<VariantPrimaryAttribute> builder)
    {
        builder.Property(v => v.Value)
            .HasMaxLength(50)
            .IsRequired();
    }
}
