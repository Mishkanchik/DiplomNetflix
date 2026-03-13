using MediatR;

namespace NetflixClone.Application.UseCases.Genres.Commands.UpdateGenre;

public class UpdateGenreCommand : IRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}