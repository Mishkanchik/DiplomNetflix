using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.ChangePassword;

public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand>
{
    private readonly UserManager<User> _userManager;

    public ChangePasswordHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());

        if (user == null)
            throw new Exception("Користувача не знайдено");

        var result = await _userManager.ChangePasswordAsync(
            user,
            request.CurrentPassword,
            request.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Помилка зміни пароля: {errors}");
        }
    }
}