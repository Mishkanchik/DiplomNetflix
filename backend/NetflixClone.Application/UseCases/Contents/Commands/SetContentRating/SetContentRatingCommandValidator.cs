using FluentValidation;

namespace NetflixClone.Application.UseCases.Contents.Commands.SetContentRating;

public class SetContentRatingCommandValidator : AbstractValidator<SetContentRatingCommand>
{
    public SetContentRatingCommandValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty().WithMessage("ID контенту обов'язкове.");

        RuleFor(x => x.Value)
            .InclusiveBetween(1, 5).WithMessage("Оцінка має бути від 1 до 5 зірочок.");
    }
}