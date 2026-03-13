using MediatR;
using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.UpdateUser;

public class UpdateUserCommand : IRequest
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public IFormFile? Avatar { get; set; }
    public List<string> Roles { get; set; } = new();
    public Guid? PlanId { get; set; }
    public bool IsBlocked { get; set; }
}