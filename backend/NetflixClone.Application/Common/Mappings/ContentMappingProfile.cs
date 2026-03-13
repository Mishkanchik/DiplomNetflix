using AutoMapper;
using NetflixClone.Application.UseCases.Contents.Commands.CreateContent;
using NetflixClone.Application.UseCases.Contents.Commands.UpdateContent;
using NetflixClone.Application.UseCases.Contents.Queries.GetContents;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.Common.Mappings;

public class ContentMappingProfile : Profile
{
    public ContentMappingProfile()
    {
        CreateMap<CreateContentCommand, Content>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
            .ForMember(dest => dest.PosterUrl, opt => opt.Ignore())
            .ForMember(dest => dest.DetailsPosterUrl, opt => opt.Ignore())
            .ForMember(dest => dest.FullVideoUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Genres, opt => opt.Ignore())
            .ForMember(dest => dest.Collections, opt => opt.Ignore())
            .ForMember(dest => dest.Episodes, opt => opt.Ignore());

        CreateMap<UpdateContentCommand, Content>()
            .ForMember(dest => dest.PosterUrl, opt => opt.Ignore())
            .ForMember(dest => dest.DetailsPosterUrl, opt => opt.Ignore())
            .ForMember(dest => dest.FullVideoUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Genres, opt => opt.Ignore())
            .ForMember(dest => dest.Collections, opt => opt.Ignore());

        CreateMap<Content, ContentDto>();
    }
}