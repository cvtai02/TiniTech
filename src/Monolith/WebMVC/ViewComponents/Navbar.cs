using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using SharedViewModels.Categories;

namespace WebMVC.ViewComponents;

public class Navbar : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        // TODO: Replace with service/database call
        var categories = new List<CategoryDto>
        {
            new() {
                Id = 1, Name = "Electronics", Slug = "electronics",
                Subcategories =
                [
                    new() { Id = 2, Name = "Phones", Slug = "phones" },
                    new() { Id = 3, Name = "Laptops", Slug = "laptops" }
                ]
            },
            new() {
                Id = 4, Name = "Clothing", Slug = "clothing"
            }
        };

        await Task.Delay(1); // Simulate async work

        return View(categories);
    }
}