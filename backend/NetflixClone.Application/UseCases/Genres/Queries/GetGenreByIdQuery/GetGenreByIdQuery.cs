using MediatR;
using NetflixClone.Application.UseCases.Genres.Queries.GetGenres;

namespace NetflixClone.Application.UseCases.Genres.Queries.GetGenreById;

public class GetGenreByIdQuery : IRequest<GenreDto>
{
    public Guid Id { get; set; }
}