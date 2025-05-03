using Catalog.Application.Common.Exceptions.Base;

namespace Catalog.Application.Common.Exceptions;

public class ProductActivationException : AbstractException
{
    public ProductActivationException(string? detail) : base("Faild to activate product.", 400, detail)
    {
    }

    public ProductActivationException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}
