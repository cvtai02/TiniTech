using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedKernel.Base;

namespace Identity.Core.Domain.Entities;

public class Claim : BaseAuditableEntity
{
    public string Type { get; set; } = null!;
    public string Value { get; set; } = null!;
    public List<Role> Roles { get; set; } = [];
    public List<User> Users { get; set; } = [];

}
