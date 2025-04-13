using Domain.Constants;

namespace Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = String.Empty;
        public string Phone { get; set; } = String.Empty;
        public string ImageUrl { get; set; } = String.Empty;
        public string Hash { get; set; } = null!;
        public string Role { get; set; } = Roles.Customer;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; } = null;
        public bool IsDeleted => DeletedAt != null;
        public User Clone()
        {
            return new User
            {
                Id = this.Id,
                Name = this.Name,
                Email = this.Email,
                Phone = this.Phone,
                ImageUrl = this.ImageUrl,
                Hash = this.Hash,
                Role = this.Role,
                CreatedAt = this.CreatedAt,
                UpdatedAt = this.UpdatedAt,
                DeletedAt = this.DeletedAt,
            };
        }
    }
}