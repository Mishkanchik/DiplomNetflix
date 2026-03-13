using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Infrastructure.Persistence.Repositories;

namespace NetflixClone.Infrastructure.Persistence.Repositoriesl;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }
    public async Task UpdateAvatarAsync(Guid userId, string avatarUrl)
    {
        var user = await GetByIdAsync(userId);

        if (user != null)
        {
            user.AvatarUrl = avatarUrl;

            await UpdateAsync(user);
        }
    }

    public  async Task DeleteAvatarAsync(Guid userId)
    {
        var user = await GetByIdAsync(userId);

        if (user != null)
        {
            user.AvatarUrl = null;

            await UpdateAsync(user);
        }
    }

    // Для Create
    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default)
    {
        return await _dbSet.AnyAsync(u => u.Email == email, ct);
    }

    // Для Update
    public async Task<bool> ExistsByEmailAsync(string email, Guid excludeUserId, CancellationToken ct = default)
    {
        return await _dbSet.AnyAsync(u => u.Email == email && u.Id != excludeUserId, ct);
    }
}
