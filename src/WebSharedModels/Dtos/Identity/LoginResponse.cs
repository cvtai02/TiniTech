using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Identity;

public class LoginResponse
{
    public bool IsAuthenticated { get; set; } = false;
    public DateTime? AccessTokenExpiresTime { get; set; } = null;
    public DateTime? RefreshTokenExpiresTime { get; set; } = null;
    public UserDto? User { get; set; } = null;
}
