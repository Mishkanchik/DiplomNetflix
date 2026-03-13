using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.DeletePlan;

public class DeleteSubscriptionPlanHandler : IRequestHandler<DeleteSubscriptionPlanCommand>
{
    private readonly ISubscriptionPlanRepository _repository;

    public DeleteSubscriptionPlanHandler(ISubscriptionPlanRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(DeleteSubscriptionPlanCommand request, CancellationToken ct)
    {
        var plan = await _repository.GetByIdAsync(request.Id, ct);

        if (plan == null)
        {
            throw new Exception("Підписки не знайдено.");
        }

        await _repository.DeleteAsync(request.Id, ct);
    }
}