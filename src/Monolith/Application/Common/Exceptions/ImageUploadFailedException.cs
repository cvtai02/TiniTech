using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Exceptions.Base;

namespace Application.Common.Exceptions;

public class ImageUploadFailException : AbstractException
{
    public ImageUploadFailException(string? detail) : base("Failed to upload images", 500, detail)
    {
    }

    public ImageUploadFailException(string title, int statusCode, string? detail) : base(title, statusCode, detail)
    {
    }
}
