using FluentValidation;
using NetflixClone.Application.UseCases.Favorite.Commands.RemoveFromFavorite;

namespace NetflixClone.Application.UseCases.Favorite.Commands.RemoveFromFavorite;

public class RemoveFromFavoriteCommandValidator : AbstractValidator<RemoveFromFavoriteCommand>
{
    public RemoveFromFavoriteCommandValidator()
    {
        RuleFor(x => x.FavoriteId)
            .NotEmpty().WithMessage("FavoriteId не може бути пустим");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId не може бути пустим");
    }
}