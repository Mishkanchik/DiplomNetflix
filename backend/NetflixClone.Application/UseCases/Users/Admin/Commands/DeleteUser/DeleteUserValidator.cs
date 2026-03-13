using FluentValidation;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.DeleteUser;

public class DeleteUserValidator : AbstractValidator<DeleteUserCommand>
{
    public DeleteUserValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Ідентифікатор користувача є обов'язковим.")
            .NotEqual(Guid.Empty).WithMessage("Вказано некоректний ідентифікатор.");
    }
}