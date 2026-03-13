namespace NetflixClone.Application.Interfaces;

public interface ISmtpService
{
    Task<bool> SendEmailAsync(string to, string subject, string body);
}