using AutoMapper;
using MediatR;
using Hangfire;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Enums;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Contents.Commands.CreateContent;

public class CreateContentHandler : IRequestHandler<CreateContentCommand, Guid>
{
    private readonly IContentRepository _contentRepository;
    private readonly IGenreRepository _genreRepository;
    private readonly ICollectionRepository _collectionRepository;
    private readonly IImageService _imageService;
    private readonly IVideoService _videoService;
    private readonly IMapper _mapper;

    public CreateContentHandler(
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

    public async Task<Guid> Handle(CreateContentCommand request, CancellationToken ct)
    {
        var content = _mapper.Map<Content>(request);

        // 1. Обробка зображень (Постер та Детальний постер)
        content.PosterUrl = await _imageService.UploadAsync(
            request.PosterFile,
            MediaFolders.Posters,
            ImageSizeConstants.PosterWidth,
            ImageSizeConstants.PosterHeight);

        content.DetailsPosterUrl = await _imageService.UploadAsync(
            request.DetailsPosterFile,
            MediaFolders.Backdrops,
            ImageSizeConstants.BackdropWidth,
            ImageSizeConstants.BackdropHeight);

        if (string.IsNullOrEmpty(content.PosterUrl) || string.IsNullOrEmpty(content.DetailsPosterUrl))
        {
            throw new Exception("Помилка завантаження зображень.");
        }

        // 2. Логіка для ВІДЕО (тільки якщо це Фільм)
        if (request.Type == ContentType.Movie && request.VideoFile != null)
        {
            // Зберігаємо оригінальний файл як тимчасовий
            content.OriginalVideoPath = await _videoService.UploadAsync(request.VideoFile, MediaFolders.Movies);

            if (string.IsNullOrEmpty(content.OriginalVideoPath))
            {
                throw new Exception("Помилка завантаження оригінального відеофайлу.");
            }

            // Встановлюємо початковий статус обробки
            content.VideoStatus = VideoStatus.Pending; //
        }

        // 3. Додавання Жанрів та Колекцій
        if (request.GenreIds.Any())
        {
            var genres = await _genreRepository.FindAsync(g => request.GenreIds.Contains(g.Id), ct);
            foreach (var genre in genres) content.Genres.Add(genre);
        }

        if (request.CollectionIds.Any())
        {
            var collections = await _collectionRepository.FindAsync(c => request.CollectionIds.Contains(c.Id), ct);
            foreach (var col in collections) content.Collections.Add(col);
        }

        // 4. Збереження в Базу Даних
        await _contentRepository.AddAsync(content, ct);

        // 5. ЗАПУСК ФОНОВОЇ ОБРОБКИ (Hangfire)
        // Важливо: запускаємо ТІЛЬКИ після того, як content.Id з'явився в БД
        if (request.Type == ContentType.Movie && !string.IsNullOrEmpty(content.OriginalVideoPath))
        {
            BackgroundJob.Enqueue<IVideoService>(x =>
                x.ProcessVideoHlsAsync(content.Id, content.OriginalVideoPath, false));
            // false вказує, що це Content (Фільм), а не Episode
        }

        return content.Id;
    }
}