using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface IFavoriteRepository : IGenericRepository<Favorite>
{
    Task<List<Favorite>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Favorite?> GetByUserAndContentAsync(Guid userId, Guid contentId, CancellationToken cancellationToken = default);
}