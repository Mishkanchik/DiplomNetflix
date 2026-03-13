using NetflixClone.Domain.Common;

namespace NetflixClone.Domain.Entities;

public class UserSubscription : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid PlanId { get; set; }
    public SubscriptionPlan Plan { get; set; } = null!;

    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime EndDate { get; set; }
    public bool IsAutoRenew { get; set; } = true;

    public string? PaymentProviderTransactionId { get; set; }
}