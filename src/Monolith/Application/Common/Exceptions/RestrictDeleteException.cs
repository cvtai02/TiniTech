using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Exceptions;

public class RestrictDeleteException : Exception
{
    public RestrictDeleteException(string message) : base(message)
    {
    }
}

