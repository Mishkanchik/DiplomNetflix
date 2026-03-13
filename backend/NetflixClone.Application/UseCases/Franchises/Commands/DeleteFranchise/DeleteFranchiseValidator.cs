using FluentValidation;

namespace NetflixClone.Application.UseCases.Franchises.Commands.DeleteFranchise;

public class DeleteFranchiseValidator : AbstractValidator<DeleteFranchiseCommand>
{
    public DeleteFranchiseValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID франшизи обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID франшизи.");
    }
}