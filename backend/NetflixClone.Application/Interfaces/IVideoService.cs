using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.Interfaces;

public interface IVideoService
{
    Task<string> UploadAsync(IFormFile file, string subFolder);
    Task DeleteAsync(string pathInDb);
    Task ProcessVideoHlsAsync(Guid id, string originalPathInDb, bool isEpisode);
}
