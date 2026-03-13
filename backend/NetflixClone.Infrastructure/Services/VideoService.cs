using FFMpegCore;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Enums;
using NetflixClone.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using FFMpegCore.Enums;

namespace NetflixClone.Infrastructure.Services;

public class VideoService(
    IConfiguration configuration,
    ApplicationDbContext dbContext) : IVideoService // Додали контекст БД
{
    private const string RootMediaFolder = "media";
    private string DirVideoName => configuration["DirVideoName"] ?? "videos";

    // 1. Швидке завантаження оригіналу (те, що ти вже мав)
    public async Task<string> UploadAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0) return string.Empty;

        var fileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
        var pathInDb = Path.Combine(DirVideoName, subFolder, fileName).Replace("\\", "/");
        var fullPath = GetFullDiskPath(pathInDb);

        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return pathInDb;
    }

    public async Task ProcessVideoHlsAsync(Guid id, string originalPathInDb, bool isEpisode)
    {
        var entity = isEpisode
            ? await dbContext.Episodes.FirstOrDefaultAsync(e => e.Id == id) as dynamic
            : await dbContext.Contents.FirstOrDefaultAsync(c => c.Id == id) as dynamic;

        if (entity == null) return;

        try
        {
            entity.VideoStatus = VideoStatus.Processing;
            await dbContext.SaveChangesAsync();

            var fullOriginalPath = GetFullDiskPath(originalPathInDb);
            var outputFolder = Path.Combine(Path.GetDirectoryName(fullOriginalPath)!, Path.GetFileNameWithoutExtension(fullOriginalPath));

            // 1. ПОВНЕ ОЧИЩЕННЯ ПАПКИ
            if (Directory.Exists(outputFolder))
            {
                Directory.Delete(outputFolder, true);
            }
            Directory.CreateDirectory(outputFolder);

            // Створюємо підпапки вручну
            Directory.CreateDirectory(Path.Combine(outputFolder, "v0"));
            Directory.CreateDirectory(Path.Combine(outputFolder, "v1"));
            Directory.CreateDirectory(Path.Combine(outputFolder, "v2"));

            var masterPlaylistPath = Path.Combine(outputFolder, "master.m3u8");

            // Підготовка шляху для FFmpeg (з прямими слешами)
            string normalizedOutputFolder = outputFolder.Replace("\\", "/");

            // 2. ОСНОВНА КОМАНДА
            await FFMpegArguments
                .FromFileInput(fullOriginalPath)
                .OutputToFile($"{normalizedOutputFolder}/v%v/index.m3u8", true, options => options
                    .WithVideoCodec(VideoCodec.LibX264)
                    .ForceFormat("hls")
                    .WithCustomArgument("-filter_complex \"[0:v]split=3[v1][v2][v3]; [v1]scale=w=854:h=480[v1out]; [v2]scale=w=1280:h=720[v2out]; [v3]scale=w=1920:h=1080[v3out]\"")

                    .WithCustomArgument("-map \"[v1out]\" -map 0:a -b:v:0 800k")
                    .WithCustomArgument("-map \"[v2out]\" -map 0:a -b:v:1 2800k")
                    .WithCustomArgument("-map \"[v3out]\" -map 0:a -b:v:2 5000k")

                    .WithCustomArgument("-hls_time 10")
                    .WithCustomArgument("-hls_list_size 0")
                    .WithCustomArgument("-hls_playlist_type vod")
                    .WithCustomArgument("-hls_flags independent_segments")

                    // Вказуємо майстер-файл
                    .WithCustomArgument("-master_pl_name master.m3u8")
                    .WithCustomArgument("-var_stream_map \"v:0,a:0 v:1,a:1 v:2,a:2\"")

                    // КРИТИЧНА ЗМІНА: Додаємо normalizedOutputFolder до назви сегментів!
                    .WithCustomArgument($"-hls_segment_filename \"{normalizedOutputFolder}/v%v/seg%03d.ts\""))
                .ProcessAsynchronously();

            var relativeMasterPath = Path.GetRelativePath(Path.Combine(Directory.GetCurrentDirectory(), RootMediaFolder), masterPlaylistPath).Replace("\\", "/");
            entity.FullVideoUrl = relativeMasterPath;
            entity.VideoStatus = VideoStatus.Ready;
            await dbContext.SaveChangesAsync();

            if (File.Exists(fullOriginalPath)) File.Delete(fullOriginalPath);
        }
        catch (Exception ex)
        {
            entity.VideoStatus = VideoStatus.Error;
            await dbContext.SaveChangesAsync();
            throw new Exception($"FFmpeg Error: {ex.Message}", ex);
        }
    }

    public async Task DeleteAsync(string pathInDb)
    {
        if (string.IsNullOrEmpty(pathInDb)) return;

        var fullPath = GetFullDiskPath(pathInDb);

        await Task.Run(() =>
        {
            if (pathInDb.EndsWith(".m3u8", StringComparison.OrdinalIgnoreCase))
            {
                var directoryPath = Path.GetDirectoryName(fullPath);
                if (directoryPath != null && Directory.Exists(directoryPath))
                {
                    Directory.Delete(directoryPath, true);
                }
            }
            else if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        });
    }

    private string GetFullDiskPath(string pathInDb) =>
        Path.Combine(Directory.GetCurrentDirectory(), RootMediaFolder, pathInDb);
}