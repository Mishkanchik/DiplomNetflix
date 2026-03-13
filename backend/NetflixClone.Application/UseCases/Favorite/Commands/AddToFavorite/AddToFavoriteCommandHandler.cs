using MediatR;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Favorite.Commands.AddToFavorite;

public class AddToFavoriteCommandHandler : IRequestHandler<AddToFavoriteCommand, Guid>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public AddToFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<Guid> Handle(AddToFavoriteCommand request, CancellationToken ct)
    {
        var existing = await _favoriteRepository
            .GetByUserAndContentAsync(request.UserId, request.ContentId, ct);

        if (existing != null)
            throw new InvalidOperationException("Цей контент вже є у ваших улюблених");

        var favorite = new Domain.Entities.Favorite
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            ContentId = request.ContentId
        };

        await _favoriteRepository.AddAsync(favorite, ct);

        return favorite.Id;
    }
}