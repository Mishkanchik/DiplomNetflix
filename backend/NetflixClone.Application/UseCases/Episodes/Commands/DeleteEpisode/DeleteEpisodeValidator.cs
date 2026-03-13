using FluentValidation;

namespace NetflixClone.Application.UseCases.Episodes.Commands.DeleteEpisode;

public class DeleteEpisodeValidator : AbstractValidator<DeleteEpisodeCommand>
{
    public DeleteEpisodeValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Ідентифікатор епізоду обов'язковий для видалення.");
    }
}