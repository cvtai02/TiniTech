using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Identity;

public class AuthTokenDto
{
    public bool IsAuthenticated { get; set; } = false;
    public DateTime? AccessTokenExpiresTime { get; set; } = null;
    public string? RefreshToken { get; set; } = string.Empty;
}
