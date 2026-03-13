using AutoMapper;
using NetflixClone.Application.UseCases.SubscriptionPlans.Commands.CreatePlan;
using NetflixClone.Application.UseCases.SubscriptionPlans.Commands.UpdatePlan;
using NetflixClone.Application.UseCases.SubscriptionPlans.Queries;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.Common.Mappings;

public class SubscriptionMappingProfile : Profile
{
    public SubscriptionMappingProfile()
    {
        CreateMap<CreateSubscriptionPlanCommand, SubscriptionPlan>();
        CreateMap<UpdateSubscriptionPlanCommand, SubscriptionPlan>();
        CreateMap<SubscriptionPlan, SubscriptionPlanDto>();
    }
}