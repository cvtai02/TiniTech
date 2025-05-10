using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Rating;

public class UserRatingDto
{
    public string UserId { get; set; } = null!;
    public int ProductId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public int Rating { get; set; } // Rating value (1-5)
    public string Comment { get; set; } = string.Empty;
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
