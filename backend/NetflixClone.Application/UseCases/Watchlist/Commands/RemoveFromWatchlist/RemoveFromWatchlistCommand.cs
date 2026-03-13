using MediatR;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.RemoveFromWatchlist;

public class RemoveFromWatchlistCommand : IRequest
{
    public Guid WatchlistId { get; set; }
    public Guid UserId { get; set; }
}