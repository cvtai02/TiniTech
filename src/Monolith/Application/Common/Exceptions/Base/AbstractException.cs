using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Exceptions.Base;

public class AbstractException : Exception
{
    public string Title { get; set; } = "Something went wrong";
    public int StatusCode { get; set; } = 500;
    public string Detail { get; set; } = "Something went wrong";

    public AbstractException(string title, int statusCode, string? detail) : base(detail)
    {
        Title = title;
        Detail = detail ?? title;
        StatusCode = statusCode;
    }

    public AbstractException(string title, int statusCode, string? detail, Exception innerException) : base(detail, innerException)
    {
        Title = title;
        StatusCode = statusCode;
        Detail = detail ?? title;
    }

}
