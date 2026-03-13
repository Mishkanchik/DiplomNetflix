using MediatR;

namespace NetflixClone.Application.UseCases.Users.Admin.Queries.GetUserById;

public class GetUserByIdQuery : IRequest<UserAdminDto>
{
    public Guid Id { get; set; }
}