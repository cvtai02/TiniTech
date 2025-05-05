namespace Catalog.Application.Common.Exceptions;

public class NoActionException : AbstractException
{
    public NoActionException(string? detail) : base("No action was performed.", 400, detail)
    {
    }

    public NoActionException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}
