using FluentValidation;

using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Collections.Commands.DeleteCollection;

public class DeleteCollectionValidator : AbstractValidator<DeleteCollectionCommand>
{
    private readonly ICollectionRepository _collectionRepository;

    public DeleteCollectionValidator(ICollectionRepository collectionRepository)
    {
        _collectionRepository = collectionRepository;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID категорії обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID.")
            .MustAsync(NotHaveAssociatedContent).WithMessage("Неможливо видалити категорію, що містить контент.");
    }

    private async Task<bool> NotHaveAssociatedContent(Guid id, CancellationToken ct)
    {
        var hasContent = await _collectionRepository.HasAnyContentAsync(id, ct);
        return !hasContent;
    }
}