using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.UpdateMyProfile;

public class UpdateMyProfileHandler : IRequestHandler<UpdateMyProfileCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly IImageService _imageService;
    private readonly IMapper _mapper;

    public UpdateMyProfileHandler(
        UserManager<User> userManager,
        IImageService imageService,
        IMapper mapper)
    {
        _userManager = userManager;
        _imageService = imageService;
        _mapper = mapper;
    }

    public async Task Handle(UpdateMyProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user == null) throw new Exception("Користувача не знайдено");

        if (request.Avatar != null)
        {
            var oldAvatarUrl = user.AvatarUrl;
            var newAvatarUrl = await _imageService.UploadAsync(
                request.Avatar,
                MediaFolders.Avatars,
                ImageSizeConstants.AvatarWidth,
                ImageSizeConstants.AvatarHeight
                );

            if (!string.IsNullOrEmpty(newAvatarUrl))
            {
                user.AvatarUrl = newAvatarUrl;
                if (!string.IsNullOrEmpty(oldAvatarUrl))
                {
                    await _imageService.DeleteAsync(oldAvatarUrl);
                }
            }
        }

        _mapper.Map(request, user);

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Помилка оновлення профілю: {errors}");
        }
    }
}