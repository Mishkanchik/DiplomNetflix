using MediatR;

namespace NetflixClone.Application.UseCases.Watchlist.Queries.GetWatchlist;

public class GetWatchlistQuery : IRequest<List<WatchlistDto>>
{
    public Guid UserId { get; set; }
    public bool? OnlyUnwatched { get; set; }
}