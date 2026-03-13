using MediatR;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.UpdatePlan;

public class UpdateSubscriptionPlanCommand : IRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Quality { get; set; } = string.Empty;
    public int MaxDevices { get; set; }
    public bool IsActive { get; set; }
}