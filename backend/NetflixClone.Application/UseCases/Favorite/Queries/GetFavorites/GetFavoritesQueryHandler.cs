using AutoMapper;
using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Favorite.Queries.GetFavorites;

public class GetFavoritesQueryHandler : IRequestHandler<GetFavoritesQuery, List<FavoriteDto>>
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly IMapper _mapper;

    public GetFavoritesQueryHandler(
        IFavoriteRepository favoriteRepository,
        IMapper mapper)
    {
        _favoriteRepository = favoriteRepository;
        _mapper = mapper;
    }

    public async Task<List<FavoriteDto>> Handle(GetFavoritesQuery request, CancellationToken ct)
    {
        var favorites = await _favoriteRepository
            .GetByUserIdAsync(request.UserId, ct);

        return _mapper.Map<List<FavoriteDto>>(favorites);
    }
}