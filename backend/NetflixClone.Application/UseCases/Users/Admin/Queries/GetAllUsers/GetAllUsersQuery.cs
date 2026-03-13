using MediatR;

namespace NetflixClone.Application.UseCases.Users.Admin.Queries.GetAllUsers;

public class GetAllUsersQuery: IRequest<List<UserAdminDto>>{}