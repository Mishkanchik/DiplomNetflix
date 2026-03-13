using AutoMapper;
using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Queries.GetAllPlans;

public class GetAllSubscriptionPlansHandler : IRequestHandler<GetAllSubscriptionPlansQuery, List<SubscriptionPlanDto>>
{
    private readonly ISubscriptionPlanRepository _repository;
    private readonly IMapper _mapper;

    public GetAllSubscriptionPlansHandler(ISubscriptionPlanRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<SubscriptionPlanDto>> Handle(GetAllSubscriptionPlansQuery request, CancellationToken ct)
    {
        var plans = await _repository.GetAllAsync(ct);
        return _mapper.Map<List<SubscriptionPlanDto>>(plans);
    }
}