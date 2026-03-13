using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Domain.Interfaces;

public interface IUserRatingRepository : IGenericRepository<UserRating>
{
    Task<UserRating?> GetByUserAndContentAsync(Guid userId, Guid contentId, CancellationToken ct = default);
}