using FluentValidation;

namespace NetflixClone.Application.UseCases.Watchlist.Commands.AddToWatchlist;

public class AddToWatchlistCommandValidator 
    : AbstractValidator<AddToWatchlistCommand>
{
    public AddToWatchlistCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId не може бути пустим");

        RuleFor(x => x.ContentId)
            .NotEmpty().WithMessage("ContentId не може бути пустим");
    }
}