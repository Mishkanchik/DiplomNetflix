using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.UseCases.Episodes.Commands.AddEpisode;

public class AddEpisodeValidator : AbstractValidator<AddEpisodeCommand>
{
    public AddEpisodeValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty().WithMessage("ID контенту (сезону) обов'язковий.");

        RuleFor(x => x.Number)
            .GreaterThan(0).WithMessage("Номер серії повинен бути більше 0.");

        RuleFor(x => x.Duration)
            .GreaterThan(0).WithMessage("Тривалість серії повинна бути більше 0.");

        RuleFor(x => x.Title)
            .MaximumLength(250).WithMessage("Назва занадто довга (макс. 250 символів).");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Опис не повинен перевищувати 1000 символів.");

        RuleFor(x => x.VideoFile)
            .NotNull().WithMessage("Файл відео обов'язковий.")
            .Must(BeAValidVideo).WithMessage("Некоректний формат відео. Дозволені: mp4, mkv, avi, mov.")
            .Must(HaveValidSize).WithMessage("Розмір відео не повинен перевищувати 2 ГБ.");
    }

    private bool BeAValidVideo(IFormFile file)
    {
        if (file == null) return false;

        var validContentTypes = new[]
        {
            "video/mp4",
            "video/x-matroska",
            "video/avi",
            "video/quicktime",
            "video/mpeg"
        };

        return validContentTypes.Contains(file.ContentType.ToLower());
    }

    private bool HaveValidSize(IFormFile file)
    {
        if (file == null) return false;

        // Ліміт 2 ГБ (2048 МБ)
        const long maxFileSize = 2L * 1024 * 1024 * 1024;
        return file.Length <= maxFileSize;
    }
}