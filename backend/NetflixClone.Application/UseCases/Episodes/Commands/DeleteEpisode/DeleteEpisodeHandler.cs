using MediatR;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Episodes.Commands.DeleteEpisode;

public class DeleteEpisodeHandler : IRequestHandler<DeleteEpisodeCommand>
{
    private readonly IEpisodeRepository _episodeRepository;
    private readonly IVideoService _videoService;

    public DeleteEpisodeHandler(IEpisodeRepository episodeRepository, IVideoService videoService)
    {
        _episodeRepository = episodeRepository;
        _videoService = videoService;
    }

    public async Task Handle(DeleteEpisodeCommand request, CancellationToken ct)
    {
        var episode = await _episodeRepository.GetByIdAsync(request.Id, ct);

        if (episode == null)
            throw new KeyNotFoundException($"Епізод з ID {request.Id} не знайдено.");

        if (!string.IsNullOrEmpty(episode.FullVideoUrl))
        {
            await _videoService.DeleteAsync(episode.FullVideoUrl);
        }

        if (!string.IsNullOrEmpty(episode.OriginalVideoPath))
        {
            await _videoService.DeleteAsync(episode.OriginalVideoPath);
        }

        await _episodeRepository.DeleteAsync(episode.Id, ct);
    }
}