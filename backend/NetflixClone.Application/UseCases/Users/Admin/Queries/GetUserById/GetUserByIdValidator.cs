using FluentValidation;

namespace NetflixClone.Application.UseCases.Users.Admin.Queries.GetUserById;

public class GetUserByIdValidator : AbstractValidator<GetUserByIdQuery>
{
    public GetUserByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Ідентифікатор користувача обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Передано некоректний або порожній ідентифікатор.");
    }
}