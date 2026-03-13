using FluentValidation;
using NetflixClone.Application.UseCases.Contents.Commands.UpdateContent;

namespace NetflixClone.Application.UseCases.Contents.Commands.UpdateContent;

public class UpdateContentValidator : AbstractValidator<UpdateContentCommand>
{
    public UpdateContentValidator()
    {
        // 1. Ідентифікація
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID контенту обов'язковий.");

        // 2. Основна інформація
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Назва не може бути порожньою.")
            .MaximumLength(200).WithMessage("Назва занадто довга (макс. 200 символів).");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Опис обов'язковий.")
            .MaximumLength(2000).WithMessage("Опис занадто довгий (макс. 2000 символів).");

        // 3. Числові показники
        RuleFor(x => x.Rating)
            .InclusiveBetween(0, 10).WithMessage("Рейтинг має бути від 0 до 10.");

        RuleFor(x => x.ReleaseYear)
            .InclusiveBetween(1888, DateTime.Now.Year + 5)
            .WithMessage("Рік випуску виглядає некоректним.");

        RuleFor(x => x.AgeLimit)
            .GreaterThanOrEqualTo(0).WithMessage("Віковий ліміт не може бути від'ємним.");

        // 4. Валідація нових файлів (якщо вони завантажені)
        RuleFor(x => x.NewPosterFile)
            .Must(f => f == null || f.Length < 5 * 1024 * 1024)
            .WithMessage("Розмір постера не повинен перевищувати 5 МБ.")
            .Must(f => f == null || IsImage(f.ContentType))
            .WithMessage("Постер повинен бути зображенням (jpg, png, webp).");

        RuleFor(x => x.NewDetailsPosterFile)
            .Must(f => f == null || f.Length < 10 * 1024 * 1024)
            .WithMessage("Розмір фонового банера не повинен перевищувати 10 МБ.")
            .Must(f => f == null || IsImage(f.ContentType))
            .WithMessage("Банер повинен бути зображенням.");

        RuleFor(x => x.NewVideoFile)
            .Must(f => f == null || IsVideo(f.ContentType))
            .WithMessage("Файл повинен бути відеоформату (mp4, mpeg, quicktime).");
    }

    private bool IsImage(string contentType)
    {
        var validTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/jpg" };
        return validTypes.Contains(contentType.ToLower());
    }

    private bool IsVideo(string contentType)
    {
        var validTypes = new[] { "video/mp4", "video/mpeg", "video/x-matroska", "video/quicktime" };
        return validTypes.Contains(contentType.ToLower());
    }
}