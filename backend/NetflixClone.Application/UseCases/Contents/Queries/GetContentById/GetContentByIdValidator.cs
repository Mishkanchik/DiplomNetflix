using FluentValidation;

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContentById;

public class GetContentByIdValidator : AbstractValidator<GetContentByIdQuery>
{
    public GetContentByIdValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("ID контенту обов'язковий.");
    }
}