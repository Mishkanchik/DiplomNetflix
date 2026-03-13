using AutoMapper;
using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.UpdatePlan;

public class UpdateSubscriptionPlanHandler : IRequestHandler<UpdateSubscriptionPlanCommand>
{
    private readonly ISubscriptionPlanRepository _repository;
    private readonly IMapper _mapper;

    public UpdateSubscriptionPlanHandler(ISubscriptionPlanRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task Handle(UpdateSubscriptionPlanCommand request, CancellationToken ct)
    {
        var plan = await _repository.GetByIdAsync(request.Id, ct);

        if (plan == null)
        {
            throw new KeyNotFoundException($"План з ID {request.Id} не знайдено.");
        }

        _mapper.Map(request, plan);

        await _repository.UpdateAsync(plan, ct);
    }
}