using FluentValidation;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.SubscriptionPlans.Commands.CreatePlan;

public class CreateSubscriptionPlanValidator : AbstractValidator<CreateSubscriptionPlanCommand>
{
    private readonly ISubscriptionPlanRepository _repository;

    public CreateSubscriptionPlanValidator(ISubscriptionPlanRepository repository)
    {
        _repository = repository;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва плану є обов'язковою.")
            .MaximumLength(50).WithMessage("Назва не може бути довшою за 50 символів.")
            .MustAsync(async (name, ct) => !await _repository.ExistsByNameAsync(name, ct))
            .WithMessage("План з такою назвою вже існує.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Ціна не може бути від'ємною.");

        RuleFor(x => x.Quality)
            .NotEmpty().WithMessage("Якість відео (SD, HD, 4K) має бути вказана.")
            .Must(q => new[] { "SD", "HD", "4K" }.Contains(q))
            .WithMessage("Дозволені значення якості: SD, HD, 4K.");

        RuleFor(x => x.MaxDevices)
            .InclusiveBetween(1, 10).WithMessage("Кількість пристроїв має бути від 1 до 10.");
    }
}