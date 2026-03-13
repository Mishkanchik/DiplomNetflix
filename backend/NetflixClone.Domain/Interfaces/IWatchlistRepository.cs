using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface IWatchlistRepository : IGenericRepository<Watchlist>
{
    Task<List<Watchlist>> GetByUserIdAsync(Guid userId, bool onlyUnwatched = false, CancellationToken cancellationToken = default);
    Task<Watchlist?> GetByUserAndContentAsync(Guid userId, Guid contentId, CancellationToken cancellationToken = default);
}