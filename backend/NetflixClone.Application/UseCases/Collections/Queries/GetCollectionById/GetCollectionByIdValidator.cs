using FluentValidation;

namespace NetflixClone.Application.UseCases.Collections.Queries.GetCollectionById;

public class GetCollectionByIdValidator : AbstractValidator<GetCollectionByIdQuery>
{
    public GetCollectionByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Ідентифікатор колекції обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Передано некоректний ідентифікатор.");
    }
}