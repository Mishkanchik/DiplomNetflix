using AutoMapper;
using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Collections.Queries.GetCollections;

public class GetCollectionsHandler : IRequestHandler<GetCollectionsQuery, List<CollectionDto>>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly IMapper _mapper;

    public GetCollectionsHandler(ICollectionRepository collectionRepository, IMapper mapper)
    {
        _collectionRepository = collectionRepository;
        _mapper = mapper;
    }

    public async Task<List<CollectionDto>> Handle(GetCollectionsQuery request, CancellationToken cancellationToken)
    {
        var collections = await _collectionRepository.GetAllAsync(cancellationToken);

        return _mapper.Map<List<CollectionDto>>(collections);
    }
}
