using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Franchises.Queries.GetFranchises;

public class GetFranchisesHandler : IRequestHandler<GetFranchisesQuery, List<FranchiseDto>>
{
    private readonly IFranchiseRepository _franchiseRepository;

    public GetFranchisesHandler(IFranchiseRepository franchiseRepository)
    {
        _franchiseRepository = franchiseRepository;
    }

    public async Task<List<FranchiseDto>> Handle(GetFranchisesQuery request, CancellationToken ct)
    {
        var franchises = await _franchiseRepository.GetAllAsync(ct);

        return franchises.Select(f => new FranchiseDto
        {
            Id = f.Id,
            Name = f.Name
        }).ToList();
    }
}