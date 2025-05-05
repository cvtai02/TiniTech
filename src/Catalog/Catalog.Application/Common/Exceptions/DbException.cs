namespace Catalog.Application.Common.Exceptions;

public class DbException : AbstractException
{
    public DbException(string detail) : base("Something went wrong.", 500, detail)
    {
    }
    public DbException(string tile, int statusCode, string detail) : base(tile, statusCode, detail)
    {
    }
}
