using MediatR;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.DeletePlan;

public class DeleteSubscriptionPlanCommand : IRequest
{
    public Guid Id { get; set; }
}