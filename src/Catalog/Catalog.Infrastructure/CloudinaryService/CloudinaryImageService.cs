using Catalog.Application.Common.Abstraction;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Catalog.Infrastructure.CloudinaryService;

public class CloudinaryImageService : IImageService
{
    private readonly Cloudinary _cloudinary;

    public IList<string> AllowImageContentTypes { get; } = new List<string>
    {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    };

    public CloudinaryImageService(IConfiguration configuration)
    {
        var cloudinarySettings = configuration.GetSection("Cloudinary");

        var account = new Account(
            cloudinarySettings["CloudName"],
            cloudinarySettings["ApiKey"],
            cloudinarySettings["ApiSecret"]
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName = null!)
    {
        if (file == null)
            throw new ArgumentNullException(nameof(file));

        if (!AllowImageContentTypes.Contains(file.ContentType))
            throw new ArgumentException($"File type {file.ContentType} is not supported.");

        // Generate a unique filename with timestamp to prevent collisions
        string uniqueFileName;
        if (string.IsNullOrEmpty(fileName))
        {
            uniqueFileName = $"{DateTimeOffset.UtcNow.Ticks}_{Guid.NewGuid()}";
        }
        else
        {
            // Append a timestamp to user-provided filename to ensure uniqueness
            string fileNameWithoutExtension = System.IO.Path.GetFileNameWithoutExtension(fileName);
            string extension = System.IO.Path.GetExtension(fileName);
            uniqueFileName = $"{fileNameWithoutExtension}_{DateTimeOffset.UtcNow.Ticks}{extension}";
        }

        // Prepare upload parameters
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(uniqueFileName, file.OpenReadStream()),
            Folder = folderName,
            PublicId = uniqueFileName,
            UseFilename = true,
            UniqueFilename = true, // This ensures Cloudinary adds uniqueness to the filename
            Overwrite = false // Prevent overwriting existing images
        };

        try
        {
            // Upload to Cloudinary
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                throw new Exception($"Failed to upload image to Cloudinary: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl.ToString();
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred when uploading the image: {ex.Message}", ex);
        }
    }

    public async Task<bool> RemoveImageAsync(string folderName, string fileName)
    {
        if (string.IsNullOrEmpty(folderName) || string.IsNullOrEmpty(fileName))
            throw new ArgumentException("Folder name and file name must be provided.");

        // Format public ID with folder
        string publicId = $"{folderName}/{fileName}";

        return await DeleteImageByPublicIdAsync(publicId);
    }

    public async Task<bool> RemoveImageAsync(string url)
    {
        if (string.IsNullOrEmpty(url))
            throw new ArgumentException("URL must be provided.", nameof(url));

        // Extract public ID from Cloudinary URL
        // Example URL: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}
        try
        {
            var uri = new Uri(url);
            var pathSegments = uri.AbsolutePath.Split('/');

            // Skip the first segments that include /image/upload/v{version}/ to get to public ID
            // Find the index of the upload part
            int uploadIndex = Array.IndexOf(pathSegments, "upload");
            if (uploadIndex == -1 || uploadIndex + 2 >= pathSegments.Length)
            {
                throw new ArgumentException("URL does not match Cloudinary format.");
            }

            // Reconstruct the public ID by joining all segments after the version segment
            var publicIdParts = pathSegments.Skip(uploadIndex + 2);
            string publicId = string.Join("/", publicIdParts);

            return await DeleteImageByPublicIdAsync(publicId);
        }
        catch (Exception ex) when (!(ex is ArgumentException))
        {
            throw new Exception($"Failed to parse Cloudinary URL: {ex.Message}", ex);
        }
    }

    private async Task<bool> DeleteImageByPublicIdAsync(string publicId)
    {
        try
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);

            return result.Result == "ok";
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred when deleting the image: {ex.Message}", ex);
        }
    }

    public async Task<List<string>> UploadImageListAsync(List<IFormFile> files, string folderName)
    {
        if (files == null || !files.Any())
            throw new ArgumentNullException(nameof(files), "No files were provided for upload.");

        if (string.IsNullOrEmpty(folderName))
            throw new ArgumentException("Folder name must be provided.", nameof(folderName));

        // Validate all files first
        foreach (var file in files)
        {
            if (!AllowImageContentTypes.Contains(file.ContentType))
                throw new ArgumentException($"File type {file.ContentType} is not supported.");
        }

        // Create tasks for all uploads to process them in parallel
        var uploadTasks = files.Select(file =>
        {
            // Each file gets a unique generated name
            return UploadImageAsync(file, folderName);
        }).ToList();

        // Wait for all tasks to complete and collect results
        var uploadedUrls = await Task.WhenAll(uploadTasks);

        // Return the list of URLs
        return uploadedUrls.ToList();
    }
}