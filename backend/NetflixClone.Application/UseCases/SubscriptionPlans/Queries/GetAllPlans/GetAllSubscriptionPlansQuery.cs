using MediatR;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Queries.GetAllPlans;

public class GetAllSubscriptionPlansQuery : IRequest<List<SubscriptionPlanDto>> {}