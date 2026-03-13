using FluentValidation;

namespace NetflixClone.Application.UseCases.Genres.Queries.GetGenreById;

public class GetGenreByIdValidator : AbstractValidator<GetGenreByIdQuery>
{
    public GetGenreByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID жанру обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID.");
    }
}