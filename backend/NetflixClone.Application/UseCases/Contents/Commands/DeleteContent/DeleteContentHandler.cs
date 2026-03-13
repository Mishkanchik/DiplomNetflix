using MediatR;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Contents.Commands.DeleteContent;

public class DeleteContentHandler : IRequestHandler<DeleteContentCommand>
{
    private readonly IContentRepository _contentRepository;
    private readonly IImageService _imageService;
    private readonly IVideoService _videoService;

    public DeleteContentHandler(
        IContentRepository contentRepository,
        IImageService imageService,
        IVideoService videoService)
    {
        _contentRepository = contentRepository;
        _imageService = imageService;
        _videoService = videoService;
    }

    public async Task Handle(DeleteContentCommand request, CancellationToken ct)
    {
        var content = await _contentRepository.GetByIdAsync(request.Id, ct);

        if (content == null)
        {
            throw new Exception("Контент не знайдено.");
        }

        if (!string.IsNullOrEmpty(content.PosterUrl))
            await _imageService.DeleteAsync(content.PosterUrl);

        if (!string.IsNullOrEmpty(content.DetailsPosterUrl))
            await _imageService.DeleteAsync(content.DetailsPosterUrl);

        if (!string.IsNullOrEmpty(content.FullVideoUrl))
            await _videoService.DeleteAsync(content.FullVideoUrl);

        await _contentRepository.DeleteAsync(content.Id, ct);
    }
}