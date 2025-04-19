using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class ProductAttribute : BaseEntity
{
    public int ProductId { get; set; }
    public int AttributeId { get; set; }
    public bool IsPrimary { get; set; } = false;
    public float OrderPriority { get; set; }
    public Product? Product { get; set; } = null!;
    public AttributeEntity? Attribute { get; set; } = null!;
    public virtual ICollection<ProductAttributeValue> ProductAttributeValues { get; set; } = new List<ProductAttributeValue>();
}
