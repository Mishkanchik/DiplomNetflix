using MediatR;
using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.UpdateMyProfile;

public class UpdateMyProfileCommand : IRequest
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public IFormFile? Avatar { get; set; }
}