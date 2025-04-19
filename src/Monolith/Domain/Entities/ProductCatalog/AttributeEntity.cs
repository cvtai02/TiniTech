using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities;

public class AttributeEntity : BaseEntity
{
    public string Name { get; set; } = null!;
}
