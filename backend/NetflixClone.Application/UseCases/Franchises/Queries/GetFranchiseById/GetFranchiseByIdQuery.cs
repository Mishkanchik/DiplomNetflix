using MediatR;

namespace NetflixClone.Application.UseCases.Franchises.Queries.GetFranchiseById;

public class GetFranchiseByIdQuery : IRequest<FranchiseDto>
{
    public Guid Id { get; set; }
}