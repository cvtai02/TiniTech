using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Exceptions.Base;

namespace Application.Common.Exceptions;

public class ProductActivationException : AbstractException
{
    public ProductActivationException(string? detail) : base("Faild to activate product.", 400, detail)
    {
    }

    public ProductActivationException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}
