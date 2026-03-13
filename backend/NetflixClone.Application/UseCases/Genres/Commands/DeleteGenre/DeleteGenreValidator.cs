using FluentValidation;

namespace NetflixClone.Application.UseCases.Genres.Commands.DeleteGenre;

public class DeleteGenreValidator : AbstractValidator<DeleteGenreCommand>
{
    public DeleteGenreValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID жанру обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID.");
    }
}