using MediatR;

namespace NetflixClone.Application.UseCases.Franchises.Commands.CreateFranchise;

public class CreateFranchiseCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
}