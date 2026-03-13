using FluentValidation;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.DeletePlan;

public class DeleteSubscriptionPlanValidator : AbstractValidator<DeleteSubscriptionPlanCommand>
{
    public DeleteSubscriptionPlanValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID плану обов'язковий.");
    }
}