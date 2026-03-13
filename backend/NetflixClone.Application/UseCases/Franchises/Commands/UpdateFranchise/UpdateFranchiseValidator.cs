using FluentValidation;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Franchises.Commands.UpdateFranchise;

public class UpdateFranchiseValidator : AbstractValidator<UpdateFranchiseCommand>
{
    private readonly IFranchiseRepository _franchiseRepository;

    public UpdateFranchiseValidator(IFranchiseRepository franchiseRepository)
    {
        _franchiseRepository = franchiseRepository;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID франшизи обов'язковий.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва франшизи обов'язкова.")
            .MinimumLength(2).WithMessage("Назва має бути не менше 2 символів.")
            .MaximumLength(255).WithMessage("Назва не може перевищувати 255 символів.")
            .MustAsync(BeUniqueNameExceptSelf).WithMessage("Франшиза з такою назвою вже існує.");
    }

    private async Task<bool> BeUniqueNameExceptSelf(UpdateFranchiseCommand command, string name, CancellationToken ct)
    {
        var existing = await _franchiseRepository.GetByNameAsync(name, ct);

        return existing == null || existing.Id == command.Id;
    }
}