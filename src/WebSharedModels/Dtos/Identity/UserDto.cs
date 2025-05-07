using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSharedModels.Dtos.Identity;

public class UserDto
{
    public string Id { get; set; }  = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Role { get; set; } = null!;
    public List<string> Claims { get; set; } = [];
    public string Phone { get; set; } = string.Empty;
    public DateTime? Locked = null;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}