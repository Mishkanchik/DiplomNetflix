using MediatR;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.CreatePlan;

public class CreateSubscriptionPlanCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Quality { get; set; } = string.Empty;
    public int MaxDevices { get; set; }
}