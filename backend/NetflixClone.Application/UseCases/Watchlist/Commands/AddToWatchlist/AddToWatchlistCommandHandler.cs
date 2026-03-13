using MediatR;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Application.UseCases.Watchlist.Commands.AddToWatchlist;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.AddToWatchlist;

public class AddToWatchlistCommandHandler 
    : IRequestHandler<AddToWatchlistCommand, Guid>
{
    private readonly IWatchlistRepository _watchlistRepository;

    public AddToWatchlistCommandHandler(IWatchlistRepository watchlistRepository)
    {
        _watchlistRepository = watchlistRepository;
    }

    public async Task<Guid> Handle(AddToWatchlistCommand request, CancellationToken ct)
    {
        var existing = await _watchlistRepository
            .GetByUserAndContentAsync(request.UserId, request.ContentId, ct);

        if (existing != null)
            throw new InvalidOperationException("Цей фільм вже у вашому Списку на потім");

        var watchlistItem = new NetflixClone.Domain.Entities.Watchlist
        {
            Id =  Guid.NewGuid(),
            UserId = request.UserId,
            ContentId = request.ContentId
        };

        await _watchlistRepository.AddAsync(watchlistItem, ct);

        return watchlistItem.Id;
    }
}