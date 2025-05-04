using SharedKernel.Base;
using SharedKernel.ValueObjects;

namespace Purchase.Core.Entities;

public class UserAddress : BaseAuditableEntity
{
    public string UserId { get; set; } = null!;

    public Address Address { get; set; } = null!;
    public bool IsDefault { get; set; }
}
