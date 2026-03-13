using AutoMapper;
using NetflixClone.Application.UseCases.Collections.Queries;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.Common.Mappings;

public class CollectionMappingProfile : Profile
{
    public CollectionMappingProfile()
    {
        CreateMap<Collection, CollectionDto>();
    }
}
