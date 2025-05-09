using System.ComponentModel;

namespace Contracts.RatingIntegrationEvents;
public class RatingCreated
{
    public int RatingId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public int Rating { get; set; }
}