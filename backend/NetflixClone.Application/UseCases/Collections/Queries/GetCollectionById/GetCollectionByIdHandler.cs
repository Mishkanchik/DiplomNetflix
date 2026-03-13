using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Collections.Queries.GetCollectionById;

public class GetCollectionByIdHandler : IRequestHandler<GetCollectionByIdQuery, CollectionDto?>
{
    private readonly ICollectionRepository _collectionRepository;

    public GetCollectionByIdHandler(ICollectionRepository collectionRepository)
    {
        _collectionRepository = collectionRepository;
    }

    public async Task<CollectionDto?> Handle(GetCollectionByIdQuery request, CancellationToken cancellationToken)
    {
        var collection = await _collectionRepository.GetByIdAsync(request.Id, cancellationToken);

        if (collection == null)
        {
            return null; 
        }

        return new CollectionDto
        {
            Id = collection.Id,
            Name = collection.Name
        };
    }
}
