using FluentValidation;

namespace NetflixClone.Application.UseCases.Favorite.Commands.AddToFavorite;

public class AddToFavoriteCommandValidator : AbstractValidator<AddToFavoriteCommand>
{
    public AddToFavoriteCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId не може бути пустим");

        RuleFor(x => x.ContentId)
            .NotEmpty().WithMessage("ContentId не може бути пустим");
    }
}