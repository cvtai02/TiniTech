using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using WebMVC.Exceptions;
using WebMVC.Models;

namespace WebMVC.ExceptionFilters;

public class GlobalExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var metadataProvider = new EmptyModelMetadataProvider();

        Console.WriteLine("GlobalExceptionFilter: " + context.Exception.ToString());

        // Set result for API controllers
        if (context.HttpContext.Request.Path.StartsWithSegments("/api"))
        {
            if (context.Exception is ApiError e)
            {
                context.Result = new JsonResult(new
                {
                    title = e.Message,
                    detail = context.Exception.Message
                })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
            else
            {
                context.Result = new JsonResult(new
                {
                    title = "Unkown error",
                    detail = context.Exception.Message
                })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        else // For MVC controllers
        {
            context.Result = new ViewResult
            {
                ViewName = "Error",
                ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), context.ModelState)
                {
                    Model = new ErrorViewModel
                    {
                        RequestId = context.HttpContext.TraceIdentifier,
                        ErrorMessage = context.Exception.Message
                    }
                }
            };
        }

        context.ExceptionHandled = true;
    }
}