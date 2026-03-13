using FluentValidation;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Franchises.Commands.CreateFranchise;

public class CreateFranchiseValidator : AbstractValidator<CreateFranchiseCommand>
{
    private readonly IFranchiseRepository _franchiseRepository;

    public CreateFranchiseValidator(IFranchiseRepository franchiseRepository)
    {
        _franchiseRepository = franchiseRepository;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва франшизи обов'язкова.")
            .MinimumLength(2).WithMessage("Назва має бути не менше 2 символів.")
            .MaximumLength(255).WithMessage("Назва не може перевищувати 255 символів.")
            .MustAsync(BeUniqueName).WithMessage("Франшиза з такою назвою вже існує.");
    }

    private async Task<bool> BeUniqueName(string name, CancellationToken ct)
    {
        // Перевірка на унікальність через специфічний метод репозиторію
        var existing = await _franchiseRepository.GetByNameAsync(name, ct);
        return existing == null;
    }
}