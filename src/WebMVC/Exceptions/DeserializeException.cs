using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Exceptions;

public class DeserializeException : Exception
{
    public DeserializeException(string message) : base(message)
    {
    }

    public DeserializeException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
