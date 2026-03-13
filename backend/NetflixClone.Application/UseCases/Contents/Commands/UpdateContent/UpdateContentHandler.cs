using AutoMapper;
using Hangfire;
using MediatR;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Enums;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Contents.Commands.UpdateContent;

public class UpdateContentHandler : IRequestHandler<UpdateContentCommand>
{
    private readonly IContentRepository _contentRepository;
    private readonly IGenreRepository _genreRepository;
    private readonly ICollectionRepository _collectionRepository;
    private readonly IImageService _imageService;
    private readonly IVideoService _videoService;
    private readonly IMapper _mapper;

    public UpdateContentHandler(
        IContentRepository contentRepository,
        IGenreRepository genreRepository,
        ICollectionRepository collectionRepository,
        IImageService imageService,
        IVideoService videoService,
        IMapper mapper)
    {
        _contentRepository = contentRepository;
        _genreRepository = genreRepository;
        _collectionRepository = collectionRepository;
        _imageService = imageService;
        _videoService = videoService;
        _mapper = mapper;
    }

    public async Task Handle(UpdateContentCommand request, CancellationToken ct)
    {
        var content = await _contentRepository.GetByIdWithDetailsAsync(request.Id, ct);

        if (content == null)
        {
            throw new Exception("Контент не знайдено.");
        }

        _mapper.Map(request, content);

        if (request.NewPosterFile != null)
        {
            if (!string.IsNullOrEmpty(content.PosterUrl))
                await _imageService.DeleteAsync(content.PosterUrl);

            content.PosterUrl = await _imageService.UploadAsync(
                request.NewPosterFile,
                "posters",
                ImageSizeConstants.PosterWidth,
                ImageSizeConstants.PosterHeight);
        }

        if (request.NewDetailsPosterFile != null)
        {
            if (!string.IsNullOrEmpty(content.DetailsPosterUrl))
                await _imageService.DeleteAsync(content.DetailsPosterUrl);

            content.DetailsPosterUrl = await _imageService.UploadAsync(
                request.NewDetailsPosterFile,
                "backdrops",
                ImageSizeConstants.BackdropWidth,
                ImageSizeConstants.BackdropHeight);
        }

        if (request.NewVideoFile != null)
        {
            if (!string.IsNullOrEmpty(content.FullVideoUrl))
                await _videoService.DeleteAsync(content.FullVideoUrl);

            content.OriginalVideoPath = await _videoService.UploadAsync(request.NewVideoFile, "movies");

            content.FullVideoUrl = null;
            content.VideoStatus = VideoStatus.Pending;

            BackgroundJob.Enqueue<IVideoService>(x =>
                x.ProcessVideoHlsAsync(content.Id, content.OriginalVideoPath, false));
        }

        content.Genres.Clear();
        if (request.GenreIds != null && request.GenreIds.Any())
        {
            var genres = await _genreRepository.FindAsync(g => request.GenreIds.Contains(g.Id), ct);
            foreach (var genre in genres) content.Genres.Add(genre);
        }

        content.Collections.Clear();
        if (request.CollectionIds != null && request.CollectionIds.Any())
        {
            var collections = await _collectionRepository.FindAsync(c => request.CollectionIds.Contains(c.Id), ct);
            foreach (var col in collections) content.Collections.Add(col);
        }

        await _contentRepository.UpdateAsync(content, ct);
    }
}