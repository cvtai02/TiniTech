using Domain.Base;
using Domain.ValueObjects;

namespace Domain.Entities;

public class UserAddress : BaseAuditableEntity
{
    public string UserId { get; set; } = null!;
    public Address Address { get; set; } = null!;
    public bool IsDefault { get; set; }
}
