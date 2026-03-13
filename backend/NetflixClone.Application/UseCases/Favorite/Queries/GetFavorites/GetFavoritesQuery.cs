using MediatR;

namespace NetflixClone.Application.UseCases.Favorite.Queries.GetFavorites;

public class GetFavoritesQuery : IRequest<List<FavoriteDto>>
{
    public Guid UserId { get; set; }
}