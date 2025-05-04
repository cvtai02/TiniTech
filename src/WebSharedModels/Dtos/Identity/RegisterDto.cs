using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Identity;

public class RegisterDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ConfirmPassword { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
}
