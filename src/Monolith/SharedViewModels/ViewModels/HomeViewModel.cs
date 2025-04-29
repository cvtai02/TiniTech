using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedViewModels.Products;

namespace SharedViewModels.ViewModels;

public class HomeViewModel
{
    public List<ProductBriefDto> BestSellers { get; set; } = [];
    public List<ProductBriefDto> HighlightedProducts { get; set; } = [];
}
