using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using WebMVC.Models;

namespace WebMVC.ExceptionFilters;

public class GlobalExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var metadataProvider = new EmptyModelMetadataProvider();

        Console.WriteLine("GlobalExceptionFilter: " + context.Exception.ToString());

        context.Result = new ViewResult
        {
            ViewName = "Error",
            ViewData = new ViewDataDictionary(metadataProvider, context.ModelState)
            {
                Model = new ErrorViewModel
                {
                    RequestId = context.HttpContext.TraceIdentifier,
                }
            }
        };

        context.ExceptionHandled = true;
    }
}