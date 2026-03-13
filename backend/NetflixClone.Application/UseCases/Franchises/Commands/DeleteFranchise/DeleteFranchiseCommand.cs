using MediatR;

namespace NetflixClone.Application.UseCases.Franchises.Commands.DeleteFranchise;

public class DeleteFranchiseCommand : IRequest
{
    public Guid Id { get; set; }
}