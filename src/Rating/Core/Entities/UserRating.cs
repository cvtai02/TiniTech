
using SharedKernel.Base;

namespace Rating.Core.Entities;

public class UserRating : BaseAuditableEntity
{
    public string UserId { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Avatar { get; set; } = null!;
    public int ProductId { get; set; } = 0;
    public int Rating { get; set; } = 5;
    public string Comment { get; set; } = "";
}
