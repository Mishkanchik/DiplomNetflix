using FluentValidation;
using NetflixClone.Application.UseCases.Collections.Commands.CreateCollection;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Categories.Commands.CreateCategory;

public class CreateCollectionValidator : AbstractValidator<CreateCollectionCommand>
{
    private readonly ICollectionRepository _collectionRepository;

    public CreateCollectionValidator(ICollectionRepository categoryRepository)
    {
        _collectionRepository = categoryRepository;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва категорії обов'язкова.")
            .MinimumLength(3).WithMessage("Назва має бути не менше 3 символів.")
            .MaximumLength(50).WithMessage("Назва не може перевищувати 50 символів.")
            .MustAsync(BeUniqueName).WithMessage("Категорія з такою назвою вже існує.");
    }

    private async Task<bool> BeUniqueName(string name, CancellationToken ct)
    {
        var existing = await _collectionRepository.GetByNameAsync(name, ct);
        return existing == null;
    }
}