using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Exceptions;

public class InfrastructureException : Exception
{
    public InfrastructureException(string message) : base(message)
    {
    }

    public InfrastructureException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
