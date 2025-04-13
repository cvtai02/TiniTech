using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;
using Domain.Entities;

namespace Domain.Events;

public class CategoryDeleteEvent(Category cat) : BaseEvent
{
    public Category Category { get; set; } = cat;
}
