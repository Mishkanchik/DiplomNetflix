using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using NetflixClone.Application.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace NetflixClone.Infrastructure.Services;

public class ImageService(IConfiguration configuration) : IImageService
{
    private const string RootMediaFolder = "media";
    private string DirImageName => configuration["DirImageName"] ?? "images";

    public async Task<string> UploadAsync(IFormFile file, string subFolder, int? width = null, int? height = null)
    {
        if (file == null || file.Length == 0) return string.Empty;

        try
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            return await SaveBytesAsync(ms.ToArray(), subFolder, width, height);
        }
        catch { return string.Empty; }
    }

    private async Task<string> SaveBytesAsync(byte[] bytes, string subFolder, int? width = null, int? height = null)
    {
        try
        {
            var fileName = $"{Path.GetRandomFileName()}.webp";
            // Шлях для БД: "images/posters/name.webp"
            var pathInDb = Path.Combine(DirImageName, subFolder, fileName).Replace("\\", "/");
            var fullPath = GetFullDiskPath(pathInDb);

            using var image = Image.Load(bytes);

            if (width.HasValue || height.HasValue)
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(width ?? 0, height ?? 0),
                    Mode = ResizeMode.Max
                }));
            }

            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
            await image.SaveAsync(fullPath, new WebpEncoder());

            return pathInDb;
        }
        catch { return string.Empty; }
    }

    public async Task DeleteAsync(string pathInDb)
    {
        if (string.IsNullOrEmpty(pathInDb)) return;

        var fullPath = GetFullDiskPath(pathInDb);

        await Task.Run(() =>
        {
            if (File.Exists(fullPath)) File.Delete(fullPath);
        });
    }

    public async Task<string> SaveFromUrlAsync(string url, string subFolder, int? width = null, int? height = null)
    {
        try
        {
            using var client = new HttpClient();
            var bytes = await client.GetByteArrayAsync(url);
            return await SaveBytesAsync(bytes, subFolder, width, height);
        }
        catch { return string.Empty; }
    }

    private string GetFullDiskPath(string pathInDb) =>
        Path.Combine(Directory.GetCurrentDirectory(), RootMediaFolder, pathInDb);
}