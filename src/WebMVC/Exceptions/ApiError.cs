using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSharedModels.Dtos.Common;

namespace WebMVC.Exceptions;

public class ApiError : Exception
{
    public ApiError(string message) : base(message)
    {
    }

    public ApiError(string message, Exception innerException) : base(message, innerException)
    {
    }

}
