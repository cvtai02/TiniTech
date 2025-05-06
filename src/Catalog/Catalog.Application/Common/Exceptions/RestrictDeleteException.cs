namespace Catalog.Application.Common.Exceptions;

public class RestrictDeleteException : AbstractException
{
    public RestrictDeleteException(string detail) : base(detail, 400, detail)
    {
    }

    public RestrictDeleteException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}

