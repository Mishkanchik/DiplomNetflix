using MediatR;

namespace NetflixClone.Application.UseCases.Favorite.Commands.AddToFavorite;

public class AddToFavoriteCommand : IRequest<Guid>
{
    public Guid UserId { get; set; }
    public Guid ContentId { get; set; }
}