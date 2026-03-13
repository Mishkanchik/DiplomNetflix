using FluentValidation;

namespace NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;

public class GetEpisodesByContentIdValidator : AbstractValidator<GetEpisodesByContentIdQuery>
{
    public GetEpisodesByContentIdValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Ідентифікатор контенту (сезону) не може бути порожнім.");
    }
}