using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Core.Application.Common.Exceptions;

public class EmailExistedException : Exception
{
    public EmailExistedException(string title) : base(title)
    {
    }

    public EmailExistedException(string title, Exception innerException) : base(title, innerException)
    {
    }
}
