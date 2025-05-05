using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Core.Application.Common.Exceptions;

public class InvalidPasswordException : Exception
{
    public InvalidPasswordException(string message) : base(message)
    {
    }

}

