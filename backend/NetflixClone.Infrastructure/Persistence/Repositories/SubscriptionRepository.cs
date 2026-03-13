using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Infrastructure.Persistence.Repositories;

public class SubscriptionRepository : BaseRepository<UserSubscription>, ISubscriptionRepository
{
    public SubscriptionRepository(ApplicationDbContext context) : base(context)
    {

    }
}