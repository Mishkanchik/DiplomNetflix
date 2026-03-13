using FluentValidation;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.RemoveFromWatchlist;

public class RemoveFromWatchlistCommandValidator 
    : AbstractValidator<RemoveFromWatchlistCommand>
{
    public RemoveFromWatchlistCommandValidator()
    {
        RuleFor(x => x.WatchlistId)
            .NotEmpty().WithMessage("WatchlistId не може бути пустим");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId не може бути пустим");
    }
}