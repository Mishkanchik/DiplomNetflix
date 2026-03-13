using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class WatchlistRepository : BaseRepository<Watchlist>, IWatchlistRepository
{
    public WatchlistRepository(ApplicationDbContext context) : base(context)
    {
        
    }

    public async Task<List<Watchlist>> GetByUserIdAsync(Guid userId, bool onlyUnwatched = false, CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Where(w => w.UserId == userId)
            .Include(w => w.Content);

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<Watchlist?> GetByUserAndContentAsync(Guid userId, Guid contentId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ContentId == contentId, cancellationToken);
    }
}