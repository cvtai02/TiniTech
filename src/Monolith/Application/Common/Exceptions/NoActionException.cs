using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Exceptions.Base;

namespace Application.Common.Exceptions;

public class NoActionException : AbstractException
{
    public NoActionException(string? detail) : base("No action was performed.", 400, detail)
    {
    }

    public NoActionException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}
