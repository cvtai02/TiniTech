using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Common.Interfaces;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName = null!);
}
