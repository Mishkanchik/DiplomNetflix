using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Franchises.Queries.GetFranchiseById;

public class GetFranchiseByIdHandler : IRequestHandler<GetFranchiseByIdQuery, FranchiseDto>
{
    private readonly IFranchiseRepository _franchiseRepository;

    public GetFranchiseByIdHandler(IFranchiseRepository franchiseRepository)
    {
        _franchiseRepository = franchiseRepository;
    }

    public async Task<FranchiseDto> Handle(GetFranchiseByIdQuery request, CancellationToken ct)
    {
        var franchise = await _franchiseRepository.GetByIdAsync(request.Id, ct);

        if (franchise == null)
        {
            throw new Exception("Франшизу не знайдено.");
        }

        return new FranchiseDto
        {
            Id = franchise.Id,
            Name = franchise.Name
        };
    }
}