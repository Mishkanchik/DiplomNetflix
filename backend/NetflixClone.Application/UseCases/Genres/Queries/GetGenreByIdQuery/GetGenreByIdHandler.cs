using MediatR;
using NetflixClone.Application.UseCases.Genres.Queries.GetGenres;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Genres.Queries.GetGenreById;

public class GetGenreByIdHandler : IRequestHandler<GetGenreByIdQuery, GenreDto>
{
    private readonly IGenreRepository _genreRepository;

    public GetGenreByIdHandler(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<GenreDto> Handle(GetGenreByIdQuery request, CancellationToken ct)
    {
        var genre = await _genreRepository.GetByIdAsync(request.Id, ct);

        if (genre == null)
        {
            throw new Exception("Жанр не знайдено.");
        }

        return new GenreDto
        {
            Id = genre.Id,
            Name = genre.Name
        };
    }
}