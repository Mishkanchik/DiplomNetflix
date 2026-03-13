using FluentValidation;

namespace NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodeById;

public class GetEpisodeByIdValidator : AbstractValidator<GetEpisodeByIdQuery>
{
    public GetEpisodeByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Ідентифікатор епізоду обов'язковий.");
    }
}