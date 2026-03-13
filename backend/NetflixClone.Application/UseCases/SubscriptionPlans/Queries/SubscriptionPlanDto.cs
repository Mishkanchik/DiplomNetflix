namespace NetflixClone.Application.UseCases.SubscriptionPlans.Queries;

public class SubscriptionPlanDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Quality { get; set; } = string.Empty; // SD, HD, 4K
    public int MaxDevices { get; set; }
    public bool IsActive { get; set; }
}