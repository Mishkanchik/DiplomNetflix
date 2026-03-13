using MediatR;

namespace NetflixClone.Application.UseCases.Auth.Commands.ForgotPassword;

public class ForgotPasswordCommand : IRequest<bool>
{
    public string Email { get; set; } = string.Empty;
}