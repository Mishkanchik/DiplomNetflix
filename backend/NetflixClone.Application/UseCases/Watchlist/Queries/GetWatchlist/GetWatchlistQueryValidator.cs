using FluentValidation;

namespace NetflixClone.Application.UseCases.Watchlist.Queries.GetWatchlist;

public class GetWatchlistQueryValidator 
    : AbstractValidator<GetWatchlistQuery>
{
    public GetWatchlistQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId не може бути пустим");
    }
}