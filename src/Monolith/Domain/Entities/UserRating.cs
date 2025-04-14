using Domain.Base;
using Domain.Enums;

namespace Domain.Entities;

public class UserRating : BaseAuditableEntity
{
    public int ProductVariantId { get; set; } = 0;
    public string UserId { get; set; } = null!;
    public Rating Rating { get; set; } = Rating.None;
    public string? Comment { get; set; } = null!;
}
