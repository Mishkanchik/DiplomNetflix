using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Enums;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Infrastructure.Persistence;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class ContentRepository : BaseRepository<Content>, IContentRepository
{
    public ContentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Content?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
    {
        var content = await _context.Contents
            .Include(c => c.Franchise)
            .Include(c => c.Genres)
            .Include(c => c.Collections)
            .Include(c => c.Episodes.OrderBy(e => e.Number))
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        if (content != null && content.Type != ContentType.Series)
        {
            content.Episodes = new List<Episode>();
        }

        return content;
    }

    public async Task<IReadOnlyList<Content>> GetAllWithDetailsAsync(CancellationToken ct = default)
    {
        return await _context.Contents
            .Include(c => c.Genres)
            .Include(c => c.Collections)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Episode>> GetEpisodesByContentIdAsync(Guid contentId, CancellationToken ct = default)
    {
        return await _context.Episodes
            .Where(e => e.ContentId == contentId)
            .OrderBy(e => e.Number)
            .AsNoTracking()
            .ToListAsync(ct);
    }
}