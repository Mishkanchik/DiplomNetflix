using AutoMapper;
using NetflixClone.Application.UseCases.Contents.Queries.GetContentById;
using NetflixClone.Application.UseCases.Episodes.Commands.AddEpisode;
using NetflixClone.Application.UseCases.Episodes.Commands.UpdateEpisode; // Додай цей using
using NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.Mappings;

public class EpisodeMappingProfile : Profile
{
    public EpisodeMappingProfile()
    {
        CreateMap<AddEpisodeCommand, Episode>()
            .ForMember(dest => dest.FullVideoUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        CreateMap<UpdateEpisodeCommand, Episode>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.FullVideoUrl, opt => opt.Ignore())
            .ForMember(dest => dest.OriginalVideoPath, opt => opt.Ignore())
            .ForMember(dest => dest.VideoStatus, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        CreateMap<Episode, EpisodeDto>();

        CreateMap<Content, ContentDetailDto>()
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres.Select(g => g.Name)))
            .ForMember(dest => dest.Episodes, opt => opt.MapFrom(src => src.Episodes.OrderBy(e => e.Number)));
    }
}