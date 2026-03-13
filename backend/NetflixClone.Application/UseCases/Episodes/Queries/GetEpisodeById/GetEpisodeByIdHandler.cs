using AutoMapper;
using MediatR;
using NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodeById;

public class GetEpisodeByIdHandler : IRequestHandler<GetEpisodeByIdQuery, EpisodeDto>
{
    private readonly IEpisodeRepository _episodeRepository;
    private readonly IMapper _mapper;

    public GetEpisodeByIdHandler(IEpisodeRepository episodeRepository, IMapper mapper)
    {
        _episodeRepository = episodeRepository;
        _mapper = mapper;
    }

    public async Task<EpisodeDto> Handle(GetEpisodeByIdQuery request, CancellationToken ct)
    {
        var episode = await _episodeRepository.GetByIdAsync(request.Id, ct);

        if (episode == null)
            throw new KeyNotFoundException($"Епізод з ID {request.Id} не знайдено.");

        return _mapper.Map<EpisodeDto>(episode);
    }
}