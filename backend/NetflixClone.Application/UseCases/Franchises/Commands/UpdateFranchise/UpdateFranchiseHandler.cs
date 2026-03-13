using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Franchises.Commands.UpdateFranchise;

public class UpdateFranchiseHandler : IRequestHandler<UpdateFranchiseCommand>
{
    private readonly IFranchiseRepository _franchiseRepository;

    public UpdateFranchiseHandler(IFranchiseRepository franchiseRepository)
    {
        _franchiseRepository = franchiseRepository;
    }

    public async Task Handle(UpdateFranchiseCommand request, CancellationToken ct)
    {
        var franchise = await _franchiseRepository.GetByIdAsync(request.Id, ct);

        if (franchise == null)
        {
            throw new Exception("Франшизу не знайдено.");
        }

        franchise.Name = request.Name;

        await _franchiseRepository.UpdateAsync(franchise, ct);
    }
}