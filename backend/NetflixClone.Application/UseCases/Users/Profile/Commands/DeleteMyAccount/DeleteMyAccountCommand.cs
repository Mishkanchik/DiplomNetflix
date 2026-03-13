using MediatR;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.DeleteMyAccount;

public class DeleteMyAccountCommand : IRequest
{
    public Guid UserId { get; set; }
}