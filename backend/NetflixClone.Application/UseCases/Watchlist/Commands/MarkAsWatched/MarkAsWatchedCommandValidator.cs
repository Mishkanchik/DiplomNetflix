using FluentValidation;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.MarkAsWatched;

public class MarkAsWatchedCommandValidator 
    : AbstractValidator<MarkAsWatchedCommand>
{
    public MarkAsWatchedCommandValidator()
    {
        RuleFor(x => x.WatchlistId)
            .NotEmpty().WithMessage("WatchlistId не може бути пустим");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId не може бути пустим");
    }
}