using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface IFranchiseRepository : IGenericRepository<Franchise>
{
    Task<Franchise?> GetByNameAsync(string name, CancellationToken ct = default);
}