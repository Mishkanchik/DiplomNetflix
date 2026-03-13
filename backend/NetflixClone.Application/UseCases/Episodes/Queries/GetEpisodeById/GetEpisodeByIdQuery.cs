using MediatR;
using NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;

namespace NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodeById;

public class GetEpisodeByIdQuery : IRequest<EpisodeDto>
{
    public Guid Id { get; set; }
}