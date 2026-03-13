using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Infrastructure.Persistence;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class FranchiseRepository : BaseRepository<Franchise>, IFranchiseRepository
{
    public FranchiseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Franchise?> GetByNameAsync(string name, CancellationToken ct = default)
    {
        return await _context.Franchises
            .FirstOrDefaultAsync(f => f.Name == name, ct);
    }
}