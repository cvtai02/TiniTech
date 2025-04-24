using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.Entities.Image;

public class Image : BaseEntity
{
    public string Url { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public Product Product { get; set; } = new Product();
}
