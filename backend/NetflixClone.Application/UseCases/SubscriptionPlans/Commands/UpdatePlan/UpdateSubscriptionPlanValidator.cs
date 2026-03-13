using FluentValidation;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.UpdatePlan;

public class UpdateSubscriptionPlanValidator : AbstractValidator<UpdateSubscriptionPlanCommand>
{
    private readonly ISubscriptionPlanRepository _repository;

    public UpdateSubscriptionPlanValidator(ISubscriptionPlanRepository repository)
    {
        _repository = repository;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID плану обов'язковий для оновлення.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва плану є обов'язковою.")
            .MustAsync(async (command, name, ct) =>
            {
                var existingPlan = await _repository.GetByIdAsync(command.Id, ct);
                if (existingPlan != null && existingPlan.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
                    return true;

                return !await _repository.ExistsByNameAsync(name, ct);
            })
            .WithMessage("Ця назва вже зайнята іншим планом.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Ціна не може бути від'ємною.");

        RuleFor(x => x.MaxDevices)
            .GreaterThan(0).WithMessage("Має бути хоча б один пристрій.");
    }
}