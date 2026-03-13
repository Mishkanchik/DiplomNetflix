using AutoMapper;
using NetflixClone.Application.UseCases.Favorite.Queries.GetFavorites;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.Mapping;

public class FavoriteMappingProfile : Profile
{
    public FavoriteMappingProfile()
    {
        CreateMap<Favorite, FavoriteDto>()
            .ForMember(dest => dest.ContentId, opt => opt.MapFrom(src => src.Content.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Content.Title))
            .ForMember(dest => dest.PosterUrl, opt => opt.MapFrom(src => src.Content.PosterUrl))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Content.Rating));
    }
}