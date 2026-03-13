using FluentValidation;

namespace NetflixClone.Application.UseCases.Episodes.Commands.UpdateEpisode;

public class UpdateEpisodeValidator : AbstractValidator<UpdateEpisodeCommand>
{
    public UpdateEpisodeValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Number).GreaterThan(0);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(250);

        When(x => x.VideoFile != null, () => {
            RuleFor(x => x.VideoFile!)
                .Must(file => file.Length <= 2L * 1024 * 1024 * 1024)
                .WithMessage("Нове відео не повинно перевищувати 2 ГБ.");
        });
    }
}