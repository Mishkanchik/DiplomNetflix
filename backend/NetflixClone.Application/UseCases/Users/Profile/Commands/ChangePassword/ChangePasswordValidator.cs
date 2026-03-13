using FluentValidation;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.ChangePassword;

public class ChangePasswordValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Поточний пароль обов'язковий.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Новий пароль обов'язковий.")
            .MinimumLength(6).WithMessage("Новий пароль має бути не менше 6 символів.")
            .NotEqual(x => x.CurrentPassword).WithMessage("Новий пароль не може збігатися з поточним.");

        RuleFor(x => x.ConfirmNewPassword)
            .Equal(x => x.NewPassword).WithMessage("Паролі не збігаються.");
    }
}