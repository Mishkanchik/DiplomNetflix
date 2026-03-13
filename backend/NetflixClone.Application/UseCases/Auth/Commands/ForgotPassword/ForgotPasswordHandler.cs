using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace NetflixClone.Application.UseCases.Auth.Commands.ForgotPassword;

public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    private readonly UserManager<User> _userManager;
    private readonly ISmtpService _smtpService;
    private readonly IConfiguration _configuration;

    public ForgotPasswordHandler(
        UserManager<User> userManager,
        ISmtpService smtpService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _smtpService = smtpService;
        _configuration = configuration;
    }

    public async Task<bool> Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return false;

        // 1. Генеруємо токен
        string token = await _userManager.GeneratePasswordResetTokenAsync(user);

        // 2. Формуємо посилання точно як у колеги
        var clientUrl = _configuration["ClientUrl"];
        var resetLink = $"{clientUrl}reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(request.Email)}";

        // 3. Формуємо тіло листа
        string subject = "Password Reset";
        string body = $"<p>Click the link below to reset your password:</p><a href='{resetLink}'>Reset Password</a>";

        return await _smtpService.SendEmailAsync(request.Email, subject, body);
    }
}