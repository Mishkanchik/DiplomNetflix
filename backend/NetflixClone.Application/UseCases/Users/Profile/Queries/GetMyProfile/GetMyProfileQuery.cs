using MediatR;

namespace NetflixClone.Application.UseCases.Users.Profile.Queries.GetMyProfile;

public class GetMyProfileQuery : IRequest<UserProfileDto>
{
    public Guid UserId { get; set; }
}