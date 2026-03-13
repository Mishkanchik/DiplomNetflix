using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class GenreRepository : BaseRepository<Genre>, IGenreRepository
{
    public GenreRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Genre?> GetByNameAsync(string name, CancellationToken ct = default)
    {
        return await _context.Genres
            .FirstOrDefaultAsync(g => g.Name == name, ct);
    }
}