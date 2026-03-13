using AutoMapper;
using MediatR;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.CreatePlan;

public class CreateSubscriptionPlanHandler : IRequestHandler<CreateSubscriptionPlanCommand, Guid>
{
    private readonly ISubscriptionPlanRepository _repository;
    private readonly IMapper _mapper;

    public CreateSubscriptionPlanHandler(ISubscriptionPlanRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Guid> Handle(CreateSubscriptionPlanCommand request, CancellationToken ct)
    {
        var plan = _mapper.Map<SubscriptionPlan>(request);
        plan.IsActive = true;

        var result = await _repository.AddAsync(plan, ct);
        return result.Id;
    }
}