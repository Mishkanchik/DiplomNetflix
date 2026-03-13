using MediatR;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Collections.Commands.CreateCollection;

public class CreateCollectionHandler : IRequestHandler<CreateCollectionCommand, Guid>
{
    private readonly ICollectionRepository _collectionRepository;

    public CreateCollectionHandler(ICollectionRepository collectionRepository)
    {
        _collectionRepository = collectionRepository;
    }

    public async Task<Guid> Handle(CreateCollectionCommand request, CancellationToken ct)
    {
        var collection = new Collection
        {
            Name = request.Name
        };

        await _collectionRepository.AddAsync(collection, ct);

        return collection.Id;
    }
}