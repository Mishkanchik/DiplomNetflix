using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface IEpisodeRepository : IGenericRepository<Episode>
{
    Task<IEnumerable<Episode>> GetByContentIdAsync(Guid contentId, CancellationToken ct);
}