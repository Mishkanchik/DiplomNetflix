using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NetflixClone.Application.Common;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Domain.Enums; // Тепер цей enum активно використовується

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContents;

public class GetContentsHandler : IRequestHandler<GetContentsQuery, PagedResponse<ContentDto>>
{
    private readonly IContentRepository _contentRepository;
    private readonly IMapper _mapper;

    public GetContentsHandler(IContentRepository contentRepository, IMapper mapper)
    {
        _contentRepository = contentRepository;
        _mapper = mapper;
    }

    public async Task<PagedResponse<ContentDto>> Handle(GetContentsQuery request, CancellationToken ct)
    {
        // 1. Отримуємо початковий запит
        var query = _contentRepository.GetQueryable();

        // 2. ОБОВ'ЯЗКОВА ФІЛЬТРАЦІЯ: показуємо лише готовий контент
        // Це гарантує, що юзер не побачить "битих" плеєрів або завантажень, що зависли
        query = query.Where(c => c.VideoStatus == VideoStatus.Ready);

        // 3. Пошук по назві (використовуємо ToLower для базової сумісності)
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(c => c.Title.ToLower().Contains(searchTerm));
        }

        // 4. Фільтрація за декількома жанрами (Логіка OR)
        if (request.GenreIds != null && request.GenreIds.Any())
        {
            // Показуємо контент, який має ХОЧА Б ОДИН із вибраних жанрів
            query = query.Where(c => c.Genres.Any(g => request.GenreIds.Contains(g.Id)));
        }

        // 5. Фільтрація за колекцією
        if (request.CollectionId.HasValue)
            query = query.Where(c => c.Collections.Any(col => col.Id == request.CollectionId.Value));

        // 6. Сортування
        query = request.SortBy?.ToLower() switch
        {
            "rating" => request.IsDescending
                ? query.OrderByDescending(c => c.Rating)
                : query.OrderBy(c => c.Rating),

            "year" => request.IsDescending
                ? query.OrderByDescending(c => c.ReleaseYear)
                : query.OrderBy(c => c.ReleaseYear),

            "title" => request.IsDescending
                ? query.OrderByDescending(c => c.Title)
                : query.OrderBy(c => c.Title),

            _ => query.OrderByDescending(c => c.CreatedAt)
        };

        // 7. Підрахунок загальної кількості (з урахуванням фільтра Ready)
        var totalCount = await query.CountAsync(ct);

        // 8. Пагінація та мапінг через ProjectTo
        // Додаємо Math.Max, щоб не впасти на Skip(-20)
        var pageNumber = Math.Max(1, request.PageNumber);
        var pageSize = Math.Max(1, request.PageSize);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<ContentDto>(_mapper.ConfigurationProvider)
            .ToListAsync(ct);

        return new PagedResponse<ContentDto>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }
}