using MediatR;

namespace NetflixClone.Application.UseCases.Franchises.Commands.UpdateFranchise;

public class UpdateFranchiseCommand : IRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}