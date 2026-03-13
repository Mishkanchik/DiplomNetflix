using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Genres.Queries.GetGenres;

public class GetGenresHandler : IRequestHandler<GetGenresQuery, List<GenreDto>>
{
    private readonly IGenreRepository _genreRepository;

    public GetGenresHandler(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<List<GenreDto>> Handle(GetGenresQuery request, CancellationToken ct)
    {
        var genres = await _genreRepository.GetAllAsync(ct);

        return genres.Select(g => new GenreDto
        {
            Id = g.Id,
            Name = g.Name
        }).ToList();
    }
}