using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Common.Abstraction;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName = null!);
    IList<string> AllowImageContentTypes { get; }
    Task<bool> RemoveImageAsync(string folderName, string fileName = null!);
    Task<bool> RemoveImageAsync(string url);
}

