using System.ComponentModel.DataAnnotations;

namespace Identity.Core.Domain.Entities;

public class Role
{
    [Key]
    public string Name { get; set; } = null!;
    public TimeSpan AccessTokenLifetime { get; set; } = TimeSpan.FromMinutes(30);
    public TimeSpan RefreshTokenLifetime { get; set; } = TimeSpan.FromDays(30);
    public List<Claim> Claims { get; set; } = [];
    public List<User> Users { get; set; } = [];

}
