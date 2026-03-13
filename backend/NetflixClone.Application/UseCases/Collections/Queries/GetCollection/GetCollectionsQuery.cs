using MediatR;

namespace NetflixClone.Application.UseCases.Collections.Queries.GetCollections;

public class GetCollectionsQuery : IRequest<List<CollectionDto>> {}
