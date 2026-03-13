using FluentValidation;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.DeleteMyAccount;

public class DeleteMyAccountValidator : AbstractValidator<DeleteMyAccountCommand>
{
    public DeleteMyAccountValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("ID користувача обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Передано порожній або некоректний ідентифікатор.");
    }
}