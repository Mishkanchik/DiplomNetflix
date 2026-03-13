using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class CollectionRepository : BaseRepository<Collection>, ICollectionRepository
{
    public CollectionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Collection?> GetByNameAsync(string name, CancellationToken ct = default)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Name == name, ct);
    }

    public async Task<bool> HasAnyContentAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbSet.AnyAsync(c => c.Id == id && c.Contents.Any(), ct);
    }
}