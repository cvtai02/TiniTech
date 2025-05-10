using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Identity;

public class LoginResponse
{
    public bool IsAuthenticated { get; set; } = false;
    public DateTimeOffset? AccessTokenExpiresTime { get; set; } = null;
    public string? AccessToken { get; set; } = null;
    public string? RefreshToken { get; set; } = null;
    public DateTimeOffset? RefreshTokenExpiresTime { get; set; } = null;
    public UserDto? User { get; set; } = null;
}
