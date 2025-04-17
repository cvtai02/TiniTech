using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; set; }
    DbSet<ProductImage> ProductImages { get; set; }
    DbSet<ProductAttribute> ProductAttributes { get; set; }
    DbSet<ProductAttributeValue> ProductAttributeValues { get; set; }
    DbSet<ProductMetric> ProductMetrics { get; set; }
    DbSet<Variant> Variants { get; set; }
    DbSet<VariantMetric> VariantMetrics { get; set; }
    DbSet<Category> Categories { get; set; }
    DbSet<CartItem> CartItems { get; set; }
    DbSet<VariantAttribute> VariantAttributes { get; set; }
    DbSet<AttributeEntity> AttributeEntities { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
