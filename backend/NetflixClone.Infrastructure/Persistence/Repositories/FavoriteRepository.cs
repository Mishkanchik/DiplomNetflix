using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Infrastructure.Persistence;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class FavoriteRepository : BaseRepository<Favorite>, IFavoriteRepository
{
    public FavoriteRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<Favorite>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Where(f => f.UserId == userId)
            .Include(f => f.Content);

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<Favorite?> GetByUserAndContentAsync(Guid userId, Guid contentId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ContentId == contentId, cancellationToken);
    }
}