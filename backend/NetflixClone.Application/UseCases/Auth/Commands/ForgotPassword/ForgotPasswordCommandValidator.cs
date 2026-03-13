using FluentValidation;
using NetflixClone.Application.UseCases.Auth.Commands.ForgotPassword;

namespace NetflixClone.Application.UseCases.Auth.Commands.ForgotPassword;

public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email є обов'язковим для заповнення.")
            .EmailAddress().WithMessage("Введено некоректний формат Email.")
            .MaximumLength(100).WithMessage("Email не може бути довшим за 100 символів.");
    }
}