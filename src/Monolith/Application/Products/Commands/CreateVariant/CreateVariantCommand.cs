using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Products.Commands.CreateVariant;

public class CreateVariantCommand
{
    public int ProductId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public int Price { get; set; }
    public List<AttributeValue> Attributes { get; set; } = [];
}

public class AttributeValue
{
    public int AttributeId { get; set; }
    public string Value { get; set; } = string.Empty;
}