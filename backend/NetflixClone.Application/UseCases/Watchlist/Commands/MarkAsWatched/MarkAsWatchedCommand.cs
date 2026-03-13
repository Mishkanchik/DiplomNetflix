using MediatR;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.MarkAsWatched;

public class MarkAsWatchedCommand : IRequest
{
    public Guid WatchlistId { get; set; }
    public Guid UserId { get; set; }
}