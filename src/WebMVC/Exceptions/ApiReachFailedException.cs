using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Exceptions;

public class ApiReachFailedException : Exception
{
    public ApiReachFailedException(string message) : base(message)
    {
    }

    public ApiReachFailedException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
