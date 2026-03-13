using MediatR;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Application.UseCases.Watchlist.Commands.RemoveFromWatchlist;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.RemoveFromWatchlist;

public class RemoveFromWatchlistCommandHandler 
    : IRequestHandler<RemoveFromWatchlistCommand>
{
    private readonly IWatchlistRepository _watchlistRepository;

    public RemoveFromWatchlistCommandHandler(IWatchlistRepository watchlistRepository)
    {
        _watchlistRepository = watchlistRepository;
    }

    public async Task Handle(RemoveFromWatchlistCommand request, CancellationToken ct)
    {
        var watchlist = await _watchlistRepository
            .GetByIdAsync(request.WatchlistId, ct);

        if (watchlist == null)
            throw new InvalidOperationException("Елемент не знайдено");

        if (watchlist.UserId != request.UserId)
            throw new UnauthorizedAccessException("Ви не маєте доступу до цього елемента");
    }
}