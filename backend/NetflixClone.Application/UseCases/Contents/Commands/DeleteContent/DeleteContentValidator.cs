using FluentValidation;

namespace NetflixClone.Application.UseCases.Contents.Commands.DeleteContent;

public class DeleteContentValidator : AbstractValidator<DeleteContentCommand>
{
    public DeleteContentValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("ID контенту не може бути порожнім.");
    }
}