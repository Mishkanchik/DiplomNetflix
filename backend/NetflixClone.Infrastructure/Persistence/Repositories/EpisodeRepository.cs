using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Infrastructure.Persistence;
using NetflixClone.Infrastructure.Persistence.Repositories;

namespace NetflixClone.Infrastructure.Repositories;

public class EpisodeRepository : BaseRepository<Episode>, IEpisodeRepository
{
    public EpisodeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Episode>> GetByContentIdAsync(Guid contentId, CancellationToken ct)
    {
        return await _context.Episodes
            .Where(e => e.ContentId == contentId)
            .OrderBy(e => e.Number)
            .AsNoTracking()
            .ToListAsync(ct);
    }
}