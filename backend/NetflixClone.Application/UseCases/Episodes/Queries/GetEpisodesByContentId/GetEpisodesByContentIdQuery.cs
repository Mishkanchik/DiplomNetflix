using MediatR;

namespace NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;

public class GetEpisodesByContentIdQuery : IRequest<IEnumerable<EpisodeDto>>
{
    public Guid ContentId { get; set; }
}