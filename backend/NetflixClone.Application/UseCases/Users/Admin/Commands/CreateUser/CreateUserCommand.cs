using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.CreateUser;

public class CreateUserCommand : IRequest<Guid>
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public IFormFile? Avatar { get; set; }
    public List<string> Roles { get; set; }
    public Guid? PlanId { get; set; }
}
