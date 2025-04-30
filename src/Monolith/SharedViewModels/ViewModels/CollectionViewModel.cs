using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using SharedViewModels.Categories;
using SharedViewModels.Common;
using SharedViewModels.Dtos.Products;
using SharedViewModels.Products;

namespace SharedViewModels.ViewModels;

public class CollectionViewModel
{
    public List<CategoryDto> Categories { get; set; } = [];
    public PaginatedList<ProductBriefDto> Products { get; set; } = new PaginatedList<ProductBriefDto>();

    public ProductQueryParameters QueryParameters { get; set; } = new ProductQueryParameters();
}
