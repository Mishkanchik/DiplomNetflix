using MediatR;

namespace NetflixClone.Application.UseCases.Genres.Commands.DeleteGenre;

public class DeleteGenreCommand : IRequest
{
    public Guid Id { get; set; }
}