using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface IGenreRepository : IGenericRepository<Genre>
{
    Task<Genre?> GetByNameAsync(string name, CancellationToken ct = default);
}