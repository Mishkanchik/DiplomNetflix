using MediatR;
using NetflixClone.Application.UseCases.Collections.Queries;

namespace NetflixClone.Application.UseCases.Collections.Queries.GetCollectionById;

public class GetCollectionByIdQuery : IRequest<CollectionDto>
{
    public Guid Id { get; set; }
}