using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.UseCases.Users.Profile.Commands.UpdateMyProfile;

public class UpdateMyProfileValidator : AbstractValidator<UpdateMyProfileCommand>
{
    public UpdateMyProfileValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("ID користувача обов'язковий.")
            .NotEqual(Guid.Empty).WithMessage("Некоректний ID користувача.");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Ім'я користувача обов'язкове.")
            .MinimumLength(3).WithMessage("Ім'я має бути не менше 3 символів.")
            .MaximumLength(50).WithMessage("Ім'я не може перевищувати 50 символів.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Електронна пошта обов'язкова.")
            .EmailAddress().WithMessage("Некоректний формат Email.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Дата народження обов'язкова.");

        RuleFor(x => x.Avatar)
            .Must(BeAValidImage).When(x => x.Avatar != null)
            .WithMessage("Дозволені формати зображень: .jpg, .jpeg, .png.");
    }

    private bool BeAValidImage(IFormFile? file)
    {
        if (file == null) return true;

        var extensions = new[] { ".jpg", ".jpeg", ".png" };
        var fileExtension = Path.GetExtension(file.FileName).ToLower();

        return extensions.Contains(fileExtension);
    }
}