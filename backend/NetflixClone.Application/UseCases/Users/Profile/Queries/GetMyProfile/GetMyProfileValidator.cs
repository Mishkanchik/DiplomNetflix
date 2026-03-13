using FluentValidation;

namespace NetflixClone.Application.UseCases.Users.Profile.Queries.GetMyProfile;

public class GetMyProfileValidator : AbstractValidator<GetMyProfileQuery>
{
    public GetMyProfileValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("Ідентифікатор користувача є обов'язковим.")
            .NotEqual(Guid.Empty).WithMessage("Вказано некоректний ідентифікатор.");
    }
}