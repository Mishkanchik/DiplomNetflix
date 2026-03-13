using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Favorite.Commands.RemoveFromFavorite;

public class RemoveFromFavoriteCommandHandler : IRequestHandler<RemoveFromFavoriteCommand>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public RemoveFromFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task Handle(RemoveFromFavoriteCommand request, CancellationToken ct)
    {
        var favorite = await _favoriteRepository
            .GetByIdAsync(request.FavoriteId, ct);

        if (favorite == null)
            throw new InvalidOperationException("Елемент не знайдено");

        if (favorite.UserId != request.UserId)
            throw new UnauthorizedAccessException("Ви не маєте доступу до цього елемента");
        
    }
}