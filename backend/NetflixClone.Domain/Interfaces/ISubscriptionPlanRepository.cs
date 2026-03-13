using NetflixClone.Domain.Entities;

namespace NetflixClone.Domain.Interfaces;

public interface ISubscriptionPlanRepository : IGenericRepository<SubscriptionPlan>
{
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default);
}