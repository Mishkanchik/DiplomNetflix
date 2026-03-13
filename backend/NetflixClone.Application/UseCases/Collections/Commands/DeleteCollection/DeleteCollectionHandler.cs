using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Collections.Commands.DeleteCollection;

public class DeleteCollectionHandler : IRequestHandler<DeleteCollectionCommand>
{
    private readonly ICollectionRepository _collectionRepository;

    public DeleteCollectionHandler(ICollectionRepository collectionRepository)
    {
        _collectionRepository = collectionRepository;
    }

    public async Task Handle(DeleteCollectionCommand request, CancellationToken cancellationToken)
    {
        var collection = await _collectionRepository.GetByIdAsync(request.Id, cancellationToken);

        if (collection == null)
        {
            throw new Exception("Колекцію не знайдено");
        }

        await _collectionRepository.DeleteAsync(request.Id, cancellationToken);
    }
}
