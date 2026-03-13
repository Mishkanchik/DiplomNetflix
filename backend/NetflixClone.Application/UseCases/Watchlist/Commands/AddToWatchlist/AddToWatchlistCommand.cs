using MediatR;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.AddToWatchlist;

public class AddToWatchlistCommand : IRequest<Guid>
{
    public Guid UserId { get; set; }
    public Guid ContentId { get; set; }
}