using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User> GetByEmailAsync(string email);
    Task UpdateAvatarAsync(Guid userId, string avatarUrl);
    Task DeleteAvatarAsync(Guid userId);
    Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> ExistsByEmailAsync(string email, Guid excludeUserId, CancellationToken ct = default);
}
