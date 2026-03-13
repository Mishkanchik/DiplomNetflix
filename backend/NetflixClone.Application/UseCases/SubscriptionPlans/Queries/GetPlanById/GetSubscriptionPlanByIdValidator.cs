using FluentValidation;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Queries.GetPlanById;

public class GetSubscriptionPlanByIdValidator : AbstractValidator<GetSubscriptionPlanByIdQuery>
{
    public GetSubscriptionPlanByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Ідентифікатор плану підписки обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Передано некоректний або порожній ідентифікатор.");
    }
}