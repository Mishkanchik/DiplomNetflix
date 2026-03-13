using AutoMapper;
using NetflixClone.Application.UseCases.Watchlist.Queries.GetWatchlist;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.Mapping;

public class WatchlistMappingProfile : Profile
{
    public WatchlistMappingProfile()
    {
        CreateMap<Watchlist, WatchlistDto>()
            .ForMember(dest => dest.ContentId, opt => opt.MapFrom(src => src.Content.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Content.Title))
            .ForMember(dest => dest.PosterUrl, opt => opt.MapFrom(src => src.Content.PosterUrl))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Content.Rating));
    }
}