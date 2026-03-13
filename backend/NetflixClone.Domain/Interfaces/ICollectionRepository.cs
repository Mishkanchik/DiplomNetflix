using NetflixClone.Domain.Entities;
namespace NetflixClone.Domain.Interfaces;

public interface ICollectionRepository : IGenericRepository<Collection>
{
    Task<Collection?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task<bool> HasAnyContentAsync(Guid id, CancellationToken cancellationToken);
}
