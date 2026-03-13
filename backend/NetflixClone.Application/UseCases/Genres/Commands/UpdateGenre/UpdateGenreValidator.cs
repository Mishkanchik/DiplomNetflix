using FluentValidation;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Genres.Commands.UpdateGenre;

public class UpdateGenreValidator : AbstractValidator<UpdateGenreCommand>
{
    private readonly IGenreRepository _genreRepository;

    public UpdateGenreValidator(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID жанру обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва жанру обов'язкова.")
            .MinimumLength(3).WithMessage("Назва має бути не менше 3 символів.")
            .MaximumLength(50).WithMessage("Назва не може перевищувати 50 символів.")
            .MustAsync(BeUniqueName).WithMessage("Інший жанр уже має таку назву.");
    }

    private async Task<bool> BeUniqueName(UpdateGenreCommand command, string name, CancellationToken ct)
    {
        var existing = await _genreRepository.GetByNameAsync(name, ct);

        return existing == null || existing.Id == command.Id;
    }
}