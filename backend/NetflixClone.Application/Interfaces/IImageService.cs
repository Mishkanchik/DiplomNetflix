using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.Interfaces;

public interface IImageService
{
    Task<string> UploadAsync(IFormFile file, string subFolder, int? width = null, int? height = null);
    Task DeleteAsync(string pathInDb);
    Task<string> SaveFromUrlAsync(string url, string subFolder, int? width = null, int? height = null);
}