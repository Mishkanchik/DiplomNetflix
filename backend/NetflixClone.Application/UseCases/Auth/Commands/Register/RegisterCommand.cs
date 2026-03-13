using MediatR;
using Microsoft.AspNetCore.Http;


namespace NetflixClone.Application.UseCases.Auth.Commands.Register;

public class RegisterCommand : IRequest<AuthResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
}
