using FluentValidation;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Genres.Commands.CreateGenre;

public class CreateGenreValidator : AbstractValidator<CreateGenreCommand>
{
    private readonly IGenreRepository _genreRepository;

    public CreateGenreValidator(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва жанру обов'язкова.")
            .MinimumLength(3).WithMessage("Назва має бути не менше 3 символів.")
            .MaximumLength(50).WithMessage("Назва не може перевищувати 50 символів.")
            .MustAsync(BeUniqueName).WithMessage("Такий жанр уже існує.");
    }

    private async Task<bool> BeUniqueName(string name, CancellationToken ct)
    {
        var existing = await _genreRepository.GetByNameAsync(name, ct);
        return existing == null;
    }
}