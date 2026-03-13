using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.DeleteUser;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly IImageService _imageService;

    public DeleteUserHandler(UserManager<User> userManager, IImageService imageService)
    {
        _userManager = userManager;
        _imageService = imageService;
    }

    public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null) throw new Exception("Користувача не знайдено");

        if (!string.IsNullOrEmpty(user.AvatarUrl))
        {
            await _imageService.DeleteAsync(user.AvatarUrl);
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Помилка при видаленні користувача: {errors}");
        }
    }
}
