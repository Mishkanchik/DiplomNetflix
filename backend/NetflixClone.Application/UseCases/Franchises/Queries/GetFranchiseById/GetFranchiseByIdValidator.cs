using FluentValidation;

namespace NetflixClone.Application.UseCases.Franchises.Queries.GetFranchiseById;

public class GetFranchiseByIdValidator : AbstractValidator<GetFranchiseByIdQuery>
{
    public GetFranchiseByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID франшизи обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID.");
    }
}