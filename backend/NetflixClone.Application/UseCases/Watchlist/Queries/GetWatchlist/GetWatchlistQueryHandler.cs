using MediatR;
using AutoMapper;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Watchlist.Queries.GetWatchlist;

public class GetWatchlistQueryHandler 
    : IRequestHandler<GetWatchlistQuery, List<WatchlistDto>>
{
    private readonly IWatchlistRepository _watchlistRepository;
    private readonly IMapper _mapper;

    public GetWatchlistQueryHandler(
        IWatchlistRepository watchlistRepository,
        IMapper mapper)
    {
        _watchlistRepository = watchlistRepository;
        _mapper = mapper;
    }

    public async Task<List<WatchlistDto>> Handle(GetWatchlistQuery request, CancellationToken ct)
    {
        var watchlists = await _watchlistRepository
            .GetByUserIdAsync(request.UserId, request.OnlyUnwatched ?? false, ct);

        return _mapper.Map<List<WatchlistDto>>(watchlists);
    }
}