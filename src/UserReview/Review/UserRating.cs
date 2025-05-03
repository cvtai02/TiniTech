using Domain.Base;

namespace Domain.Entities;

public class UserRating : BaseAuditableEntity
{
    public int ProductVariantId { get; set; } = 0;
    public string UserId { get; set; } = null!;
    public int Rating { get; set; } = -1;
    public string? Comment { get; set; } = null!;
}
