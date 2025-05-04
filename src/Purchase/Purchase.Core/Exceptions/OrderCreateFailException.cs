using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Purchase.Core.Exceptions;

public class OrderCreateFailException : Exception
{
    public OrderCreateFailException(string message) : base(message) { }


    public OrderCreateFailException(string message, Exception inner) : base(message, inner) { }

}
