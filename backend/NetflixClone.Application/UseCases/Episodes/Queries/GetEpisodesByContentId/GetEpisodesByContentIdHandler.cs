using AutoMapper;
using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;

public class GetEpisodesByContentIdHandler : IRequestHandler<GetEpisodesByContentIdQuery, IEnumerable<EpisodeDto>>
{
    private readonly IEpisodeRepository _episodeRepository;
    private readonly IMapper _mapper;

    public GetEpisodesByContentIdHandler(IEpisodeRepository episodeRepository, IMapper mapper)
    {
        _episodeRepository = episodeRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<EpisodeDto>> Handle(GetEpisodesByContentIdQuery request, CancellationToken ct)
    {
        var episodes = await _episodeRepository.GetByContentIdAsync(request.ContentId, ct);

        var sortedEpisodes = episodes.OrderBy(e => e.Number);

        return _mapper.Map<IEnumerable<EpisodeDto>>(sortedEpisodes);
    }
}