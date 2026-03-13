using MediatR;

namespace NetflixClone.Application.UseCases.Genres.Queries.GetGenres;

public class GetGenresQuery : IRequest<List<GenreDto>> {}