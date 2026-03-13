using FluentValidation;

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContents;

public class GetContentsQueryValidator : AbstractValidator<GetContentsQuery>
{
    private readonly string[] _allowedSortFields = { "rating", "year", "title" };

    public GetContentsQueryValidator()
    {

        RuleFor(x => x.PageNumber)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Номер сторінки має бути не менше 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("Кількість елементів на сторінці має бути від 1 до 100.");

        RuleFor(x => x.SearchTerm)
            .MaximumLength(100)
            .WithMessage("Пошуковий запит не може бути довшим за 100 символів.");

        RuleFor(x => x.SortBy)
            .Must(x => string.IsNullOrEmpty(x) || _allowedSortFields.Contains(x.ToLower()))
            .WithMessage($"Сортування можливе лише за полями: {string.Join(", ", _allowedSortFields)}.");

        RuleFor(x => x.GenreIds)
            .Must(x => x == null || x.Count <= 10)
            .WithMessage("Можна вибрати не більше 10 жанрів одночасно.");
    }
}