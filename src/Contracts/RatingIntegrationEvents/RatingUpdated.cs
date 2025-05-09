using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contracts.RatingIntegrationEvents;

public class RatingUpdated
{
    public int RatingId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public int NewRating { get; set; }
    public int OldRating { get; set; }
}