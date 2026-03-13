using MediatR;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.DeleteUser;

public class DeleteUserCommand : IRequest
{
    public Guid Id { get; set; }
}
