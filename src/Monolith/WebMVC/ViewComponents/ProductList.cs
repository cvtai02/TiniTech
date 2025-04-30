using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SharedViewModels.Products;

namespace WebMVC.ViewComponents;

public class ProductList : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(List<ProductBriefDto> products)
    {

        return View(products);
    }

}