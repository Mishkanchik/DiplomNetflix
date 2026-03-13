using MediatR;

namespace NetflixClone.Application.UseCases.Auth.Commands.Login;

public class LoginCommand : IRequest<AuthResponse>
{
    public string Email { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
}
