using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebMVC.ViewComponents;

public class Footer : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        await Task.Delay(1); // Simulate async work
        return View();
    }
}