using MediatR;

namespace NetflixClone.Application.UseCases.Favorite.Commands.RemoveFromFavorite;

public class RemoveFromFavoriteCommand : IRequest
{
    public Guid FavoriteId { get; set; }
    public Guid UserId { get; set; }
}