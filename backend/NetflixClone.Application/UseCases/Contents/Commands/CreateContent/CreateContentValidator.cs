using FluentValidation;
using Microsoft.AspNetCore.Http;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Application.UseCases.Contents.Commands.CreateContent;

public class CreateContentValidator : AbstractValidator<CreateContentCommand>
{
    public CreateContentValidator()
    {
        // Базова інформація
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Назва обов'язкова.")
            .MaximumLength(500).WithMessage("Назва не може бути довшою за 500 символів.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Опис обов'язковий.");

        RuleFor(x => x.ReleaseYear)
            .InclusiveBetween(1895, DateTime.Now.Year + 5).WithMessage("Вкажіть коректний рік випуску.");

        RuleFor(x => x.Rating)
            .InclusiveBetween(0, 10).WithMessage("Рейтинг має бути від 0 до 10.");

        RuleFor(x => x.AgeLimit)
            .InclusiveBetween(0, 21).WithMessage("Вкажіть коректне вікове обмеження.");

        RuleFor(x => x.PosterFile)
            .NotNull().WithMessage("Постер обов'язковий.")
            .Must(BeAValidImage).WithMessage("Постер має бути зображенням (jpg, jpeg, png, webp).");

        RuleFor(x => x.DetailsPosterFile)
            .NotNull().WithMessage("Детальний постер обов'язковий.")
            .Must(BeAValidImage).WithMessage("Детальний постер має бути зображенням (jpg, jpeg, png, webp).");

        RuleSet("TypeSpecific", () =>
        {
            RuleFor(x => x.Duration)
                .NotEmpty().GreaterThan(0)
                .When(x => x.Type == ContentType.Movie)
                .WithMessage("Для фільму необхідно вказати тривалість у хвилинах.");

            RuleFor(x => x.VideoFile)
                .NotNull()
                .When(x => x.Type == ContentType.Movie)
                .WithMessage("Для фільму необхідно завантажити відеофайл.")
                .Must(BeAValidVideo)
                .When(x => x.VideoFile != null)
                .WithMessage("Некоректний формат відеофайлу.");

            RuleFor(x => x.VideoFile)
                .Null()
                .When(x => x.Type == ContentType.Series)
                .WithMessage("Для серіалу відео завантажується окремо в епізоди.");
        });

        RuleFor(x => x.GenreIds)
            .NotEmpty().WithMessage("Оберіть хоча б один жанр.");
    }

    private bool BeAValidImage(IFormFile file)
    {
        if (file == null) return false;
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        return allowedExtensions.Contains(extension);
    }

    private bool BeAValidVideo(IFormFile file)
    {
        if (file == null) return false;
        var allowedExtensions = new[] { ".mp4", ".mkv", ".mov", ".avi" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        return allowedExtensions.Contains(extension);
    }
}