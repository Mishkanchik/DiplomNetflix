using MimeKit;
using NetflixClone.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace NetflixClone.Infrastructure.Services;

public class SmtpService : ISmtpService
{
    private readonly IConfiguration _configuration;

    public SmtpService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string body)
    {
        var from = _configuration["SmtpSettings:From"];
        var server = _configuration["SmtpSettings:Server"];
        var userName = _configuration["SmtpSettings:UserName"];
        var password = _configuration["SmtpSettings:Password"];
        var port = int.Parse(_configuration["SmtpSettings:Port"] ?? "2525");

        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("Netflix Clone", from));
        emailMessage.To.Add(new MailboxAddress("", to));
        emailMessage.Subject = subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = body };
        emailMessage.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(server, port, true);
            await client.AuthenticateAsync(userName, password);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SMTP ERROR] Спроба відправки на {to} провалена: {ex.Message}");
            return false;
        }
    }
}