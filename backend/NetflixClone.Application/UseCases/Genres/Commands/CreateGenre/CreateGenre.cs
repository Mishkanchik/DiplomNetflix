using MediatR;

namespace NetflixClone.Application.UseCases.Genres.Commands.CreateGenre;

public class CreateGenreCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
}