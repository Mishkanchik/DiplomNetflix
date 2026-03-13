using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Infrastructure.Persistence;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class UserRatingRepository : BaseRepository<UserRating>, IUserRatingRepository
{
    public UserRatingRepository(ApplicationDbContext context) : base(context) { }

    public async Task<UserRating?> GetByUserAndContentAsync(Guid userId, Guid contentId, CancellationToken ct = default)
    {
        return await _dbSet.FirstOrDefaultAsync(r => r.UserId == userId && r.ContentId == contentId, ct);
    }
}