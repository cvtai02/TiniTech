using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedKernel.Base;

namespace Identity.Core.Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = null!;
    public List<Claim> Claims { get; set; } = [];
    public List<User> Users { get; set; } = [];

}
