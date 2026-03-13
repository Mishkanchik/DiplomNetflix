using MediatR;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Franchises.Commands.CreateFranchise;

public class CreateFranchiseHandler : IRequestHandler<CreateFranchiseCommand, Guid>
{
    private readonly IFranchiseRepository _franchiseRepository;

    public CreateFranchiseHandler(IFranchiseRepository franchiseRepository)
    {
        _franchiseRepository = franchiseRepository;
    }

    public async Task<Guid> Handle(CreateFranchiseCommand request, CancellationToken ct)
    {
        var franchise = new Franchise
        {
            Name = request.Name
        };

        await _franchiseRepository.AddAsync(franchise, ct);

        return franchise.Id;
    }
}