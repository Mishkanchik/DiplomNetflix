using FluentValidation;
using NetflixClone.Application.UseCases.Auth.Commands.ResetPassword;

namespace NetflixClone.Application.UseCases.Auth.Commands.ResetPassword;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email є обов'язковим.")
            .EmailAddress().WithMessage("Некоректний формат Email.");

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Токен підтвердження обов'язковий.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Пароль не може бути порожнім.")
            .MinimumLength(8).WithMessage("Пароль повинен містити мінімум 8 символів.")
            .Matches(@"[A-Z]").WithMessage("Пароль повинен містити хоча б одну велику літеру.")
            .Matches(@"[a-z]").WithMessage("Пароль повинен містити хоча б одну малу літеру.")
            .Matches(@"[0-9]").WithMessage("Пароль повинен містити хоча б одну цифру.");
    }
}