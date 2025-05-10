using Identity.Core.Domain.Entities;
using SharedKernel.Base;

namespace Identity.Core.Domain.Entities;
public class User : BaseAuditableEntity
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = String.Empty;
    public string Phone { get; set; } = String.Empty;
    public string ImageUrl { get; set; } = String.Empty;
    public string Hash { get; set; } = null!;
    public DateTimeOffset? Locked { get; set; } = null;
    public string Role { get; set; } = null!;
    public List<Claim> Claims { get; set; } = [];
    public bool IsActive => Locked == null;
}