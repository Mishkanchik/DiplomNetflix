using AutoMapper;
using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Queries.GetPlanById;

public class GetSubscriptionPlanByIdHandler : IRequestHandler<GetSubscriptionPlanByIdQuery, SubscriptionPlanDto>
{
    private readonly ISubscriptionPlanRepository _repository;
    private readonly IMapper _mapper;

    public GetSubscriptionPlanByIdHandler(ISubscriptionPlanRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<SubscriptionPlanDto> Handle(GetSubscriptionPlanByIdQuery request, CancellationToken ct)
    {
        var plan = await _repository.GetByIdAsync(request.Id, ct);

        if (plan == null)
        {
            throw new KeyNotFoundException($"План з ID {request.Id} не знайдено.");
        }

        return _mapper.Map<SubscriptionPlanDto>(plan);
    }
}