using Microsoft.AspNetCore.Http;

namespace Catalog.Application.Common.Abstraction;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName = null!);
    Task<List<string>> UploadImageListAsync(List<IFormFile> files, string folderName);
    IList<string> AllowImageContentTypes { get; }
    Task<bool> RemoveImageAsync(string folderName, string fileName = null!);
    Task<bool> RemoveImageAsync(string url);
}

