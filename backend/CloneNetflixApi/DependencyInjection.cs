using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;
using FFMpegCore;

namespace CloneNetflix.API;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();

        var ffmpegPath = configuration["FFmpegSettings:BinaryPath"];
        if (!string.IsNullOrEmpty(ffmpegPath))
        {
            var folder = Path.GetDirectoryName(ffmpegPath);
            if (!string.IsNullOrEmpty(folder) && Directory.Exists(folder))
            {
                GlobalFFOptions.Configure(options => options.BinaryFolder = folder);

                Console.WriteLine($"[FFMPEG] Path successfully set to: {folder}");
            }
        }

        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Вставте ТІЛЬКИ токен (без слова Bearer і без лапок)"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });

        return services;
    }

    public static IApplicationBuilder UseMediaStaticFiles(this IApplicationBuilder app, IConfiguration configuration)
    {
        var rootPath = Directory.GetCurrentDirectory();
        var rootMediaFolder = "media";

        var dirImageName = configuration["DirImageName"] ?? "images";
        var imagesPath = Path.Combine(rootPath, rootMediaFolder, dirImageName);
        EnsureDirectoryExists(imagesPath);
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(imagesPath),
            RequestPath = $"/{dirImageName}"
        });

        var dirVideoName = configuration["DirVideoName"] ?? "videos";
        var videosPath = Path.Combine(rootPath, rootMediaFolder, dirVideoName);
        EnsureDirectoryExists(videosPath);

        var contentTypeProvider = new FileExtensionContentTypeProvider();

        contentTypeProvider.Mappings[".m3u8"] = "application/x-mpegURL";

        contentTypeProvider.Mappings[".ts"] = "video/MP2T";

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(videosPath),
            RequestPath = $"/{dirVideoName}",
            ContentTypeProvider = contentTypeProvider
        });

        return app;
    }

    private static void EnsureDirectoryExists(string path)
    {
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
    }
}