using FluentValidation;
using NetflixClone.Application.UseCases.Favorite.Queries.GetFavorites;

namespace NetflixClone.Application.UseCases.Favorite.Queries.GetFavorites;

public class GetFavoritesQueryValidator : AbstractValidator<GetFavoritesQuery>
{
    public GetFavoritesQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId не може бути пустим");
    }
}