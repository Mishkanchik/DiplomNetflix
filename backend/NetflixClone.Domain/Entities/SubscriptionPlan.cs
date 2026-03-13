using NetflixClone.Domain.Common;

namespace NetflixClone.Domain.Entities;

public class SubscriptionPlan : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Quality { get; set; } = "HD";
    public int MaxDevices { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
}