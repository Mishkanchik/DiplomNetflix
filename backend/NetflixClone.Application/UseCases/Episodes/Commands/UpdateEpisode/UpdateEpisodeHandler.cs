using AutoMapper;
using MediatR;
using Hangfire;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Application.UseCases.Episodes.Commands.UpdateEpisode;

public class UpdateEpisodeHandler : IRequestHandler<UpdateEpisodeCommand>
{
    private readonly IEpisodeRepository _episodeRepository;
    private readonly IVideoService _videoService;
    private readonly IMapper _mapper;

    public UpdateEpisodeHandler(IEpisodeRepository episodeRepository, IVideoService videoService, IMapper mapper)
    {
        _episodeRepository = episodeRepository;
        _videoService = videoService;
        _mapper = mapper;
    }

    public async Task Handle(UpdateEpisodeCommand request, CancellationToken ct)
    {
        // 1. Отримуємо існуючий епізод
        var episode = await _episodeRepository.GetByIdAsync(request.Id, ct);

        if (episode == null)
            throw new KeyNotFoundException($"Епізод з ID {request.Id} не знайдено.");

        // 2. ОБРОБКА НОВОГО ВІДЕО (якщо файл прийшов у запиті)
        if (request.VideoFile != null)
        {
            // А) Видаляємо старий HLS-потік (папку з сегментами)
            if (!string.IsNullOrEmpty(episode.FullVideoUrl))
            {
                await _videoService.DeleteAsync(episode.FullVideoUrl);
            }

            // Б) Видаляємо старий оригінальний .mp4, щоб не забивати диск
            if (!string.IsNullOrEmpty(episode.OriginalVideoPath))
            {
                await _videoService.DeleteAsync(episode.OriginalVideoPath);
            }

            // В) Завантажуємо новий оригінал
            string folder = $"{MediaFolders.Episodes}/{episode.ContentId}";
            episode.OriginalVideoPath = await _videoService.UploadAsync(request.VideoFile, folder);

            // Г) Скидаємо статус та шлях до плейлиста для нового циклу обробки
            episode.FullVideoUrl = null;
            episode.VideoStatus = VideoStatus.Pending;

            // Д) Додаємо завдання в чергу Hangfire
            BackgroundJob.Enqueue<IVideoService>(x =>
                x.ProcessVideoHlsAsync(episode.Id, episode.OriginalVideoPath!, true));
        }

        // 3. Мапимо текстові поля (Title, Number, Duration)
        // Важливо: Робимо це ПІСЛЯ логіки відео, щоб випадково не перезаписати статус
        _mapper.Map(request, episode);

        // 4. Зберігаємо всі зміни в БД
        await _episodeRepository.UpdateAsync(episode, ct);
    }
}