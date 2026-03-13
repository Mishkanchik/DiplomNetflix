using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface IContentRepository : IGenericRepository<Content>
{
    Task<Content?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Content>> GetAllWithDetailsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Episode>> GetEpisodesByContentIdAsync(Guid contentId, CancellationToken ct = default);
}