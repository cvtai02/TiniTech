using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using SharedViewModels.Products;

namespace SharedViewModels.ViewModels;

public class ProductViewModel
{
    public ProductDetailDto Product { get; set; } = new ProductDetailDto();
    public List<ProductBriefDto> RelatedProducts { get; set; } = new List<ProductBriefDto>();
}
