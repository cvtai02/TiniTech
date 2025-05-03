using Catalog.Application.Common.Exceptions.Base;

namespace Catalog.Application.Common.Exceptions;

public class ImageUploadFailException : AbstractException
{
    public ImageUploadFailException(string? detail) : base("Failed to upload images", 500, detail)
    {
    }

    public ImageUploadFailException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}
