namespace Catalog.Application.Common.Exceptions;

public class RestrictDeleteException : AbstractException
{
    public RestrictDeleteException(string? detail) : base("Failed to delete because of constrains", 400, detail)
    {
    }

    public RestrictDeleteException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}

