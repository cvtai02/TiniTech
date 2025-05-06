using System.ComponentModel.DataAnnotations;

namespace Identity.Core.Domain.Entities;

public class Role
{
    [Key]
    public string Name { get; set; } = null!;
    public List<Claim> Claims { get; set; } = [];
    public List<User> Users { get; set; } = [];

}
