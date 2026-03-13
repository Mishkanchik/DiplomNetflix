using AutoMapper;
using MediatR;
using Hangfire; // Додаємо для черги завдань
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Enums;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Episodes.Commands.AddEpisode;

public class AddEpisodeHandler : IRequestHandler<AddEpisodeCommand, Guid>
{
    private readonly IEpisodeRepository _episodeRepository;
    private readonly IContentRepository _contentRepository;
    private readonly IVideoService _videoService;
    private readonly IMapper _mapper;

    public AddEpisodeHandler(
        IEpisodeRepository episodeRepository,
        IContentRepository contentRepository,
        IVideoService videoService,
        IMapper mapper)
    {
        _episodeRepository = episodeRepository;
        _contentRepository = contentRepository;
        _videoService = videoService;
        _mapper = mapper;
    }

    public async Task<Guid> Handle(AddEpisodeCommand request, CancellationToken ct)
    {
        var content = await _contentRepository.GetByIdAsync(request.ContentId, ct);
        if (content == null)
            throw new KeyNotFoundException("Контент (серіал) не знайдено.");

        var episode = _mapper.Map<Episode>(request);

        string folder = $"{MediaFolders.Episodes}/{request.ContentId}";

        episode.OriginalVideoPath = await _videoService.UploadAsync(request.VideoFile, folder);

        if (string.IsNullOrEmpty(episode.OriginalVideoPath))
        {
            throw new Exception("Помилка завантаження відеофайлу епізоду.");
        }

        episode.VideoStatus = VideoStatus.Pending;
        episode.FullVideoUrl = null;

        await _episodeRepository.AddAsync(episode, ct);

        BackgroundJob.Enqueue<IVideoService>(x =>
            x.ProcessVideoHlsAsync(episode.Id, episode.OriginalVideoPath, true));

        return episode.Id;
    }
}