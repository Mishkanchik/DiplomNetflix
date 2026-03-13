using FluentValidation;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Collections.Commands.UpdateCollection;

public class UpdateCollectionValidator : AbstractValidator<UpdateCollectionCommand>
{
    private readonly ICollectionRepository _collectionRepository;

    public UpdateCollectionValidator(ICollectionRepository collectionRepository)
    {
        _collectionRepository = collectionRepository;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID колекції обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва колекції обов'язкова.")
            .MinimumLength(3).WithMessage("Назва має бути не менше 3 символів.")
            .MaximumLength(50).WithMessage("Назва не може перевищувати 50 символів.")
            .MustAsync(BeUniqueName).WithMessage("Інша колекція вже має таку назву.");
    }

    private async Task<bool> BeUniqueName(UpdateCollectionCommand command, string name, CancellationToken ct)
    {
        var existing = await _collectionRepository.GetByNameAsync(name, ct);

        return existing == null || existing.Id == command.Id;
    }
}