using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Franchises.Commands.DeleteFranchise;

public class DeleteFranchiseHandler : IRequestHandler<DeleteFranchiseCommand>
{
    private readonly IFranchiseRepository _franchiseRepository;

    public DeleteFranchiseHandler(IFranchiseRepository franchiseRepository)
    {
        _franchiseRepository = franchiseRepository;
    }

    public async Task Handle(DeleteFranchiseCommand request, CancellationToken ct)
    {
        var franchise = await _franchiseRepository.GetByIdAsync(request.Id, ct);

        if (franchise == null)
        {
            throw new Exception("Франшизу для видалення не знайдено.");
        }

        await _franchiseRepository.DeleteAsync(request.Id, ct);
    }
}