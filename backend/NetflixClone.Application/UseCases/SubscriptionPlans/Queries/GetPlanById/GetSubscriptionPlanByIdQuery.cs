using MediatR;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Queries.GetPlanById;

public class GetSubscriptionPlanByIdQuery : IRequest<SubscriptionPlanDto>
{
    public Guid Id { get; set; }
}