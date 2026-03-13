using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.DeleteMyAccount;

public class DeleteMyAccountHandler : IRequestHandler<DeleteMyAccountCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly IImageService _imageService;

    public DeleteMyAccountHandler(UserManager<User> userManager, IImageService imageService)
    {
        _userManager = userManager;
        _imageService = imageService;
    }

    public async Task Handle(DeleteMyAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user == null) throw new Exception("Користувача не знайдено");

        if (!string.IsNullOrEmpty(user.AvatarUrl))
        {
            await _imageService.DeleteAsync(user.AvatarUrl);
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Не вдалося видалити акаунт: {errors}");
        }
    }
}