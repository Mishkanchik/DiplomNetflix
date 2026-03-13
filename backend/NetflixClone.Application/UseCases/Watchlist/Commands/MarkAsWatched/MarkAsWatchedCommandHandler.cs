using MediatR;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Application.UseCases.Watchlist.Commands.MarkAsWatched;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.MarkAsWatched;

public class MarkAsWatchedCommandHandler 
    : IRequestHandler<MarkAsWatchedCommand>
{
    private readonly IWatchlistRepository _watchlistRepository;

    public MarkAsWatchedCommandHandler(IWatchlistRepository watchlistRepository)
    {
        _watchlistRepository = watchlistRepository;
    }

    public async Task Handle(MarkAsWatchedCommand request, CancellationToken ct)
    {
        var watchlist = await _watchlistRepository
            .GetByIdAsync(request.WatchlistId, ct);

        if (watchlist == null)
            throw new InvalidOperationException("Елемент не знайдено");

        if (watchlist.UserId != request.UserId)
            throw new UnauthorizedAccessException("Ви не маєте доступу до цього елемента");
    }
}