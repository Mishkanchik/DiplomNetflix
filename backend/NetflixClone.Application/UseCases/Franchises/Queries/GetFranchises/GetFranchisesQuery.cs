using MediatR;

namespace NetflixClone.Application.UseCases.Franchises.Queries.GetFranchises;

public class GetFranchisesQuery : IRequest<List<FranchiseDto>>
{
}