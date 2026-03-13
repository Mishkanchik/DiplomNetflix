using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Collections.Commands.UpdateCollection;

public class UpdateCollectionHandler : IRequestHandler<UpdateCollectionCommand>
{
    private readonly ICollectionRepository _collectionRepository;

    public UpdateCollectionHandler(ICollectionRepository collectionRepository)
    {
        _collectionRepository = collectionRepository;
    }

    public async Task Handle(UpdateCollectionCommand request, CancellationToken ct)
    {
        var collection = await _collectionRepository.GetByIdAsync(request.Id, ct);

        if (collection == null)
        {
            throw new Exception("Колекцію не знайдено.");
        }

        collection.Name = request.Name;

        await _collectionRepository.UpdateAsync(collection, ct);
    }
}
