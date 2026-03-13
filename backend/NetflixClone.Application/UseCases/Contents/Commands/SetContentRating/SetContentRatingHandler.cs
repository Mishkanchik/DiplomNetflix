using MediatR;
using Microsoft.AspNetCore.Http;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;
using System.Security.Claims;

namespace NetflixClone.Application.UseCases.Contents.Commands.SetContentRating;

public class SetContentRatingHandler : IRequestHandler<SetContentRatingCommand, Unit>
{
    private readonly IUserRatingRepository _ratingRepository;
    private readonly IContentRepository _contentRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SetContentRatingHandler(
        IUserRatingRepository ratingRepository,
        IContentRepository contentRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _ratingRepository = ratingRepository;
        _contentRepository = contentRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Unit> Handle(SetContentRatingCommand request, CancellationToken ct)
    {
        // 1. Отримуємо UserId з контексту
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out Guid userId))
            throw new UnauthorizedAccessException("Користувач не авторизований.");

        // 2. Отримуємо контент
        var content = await _contentRepository.GetByIdAsync(request.ContentId, ct);
        if (content == null) throw new KeyNotFoundException("Контент не знайдено.");

        // 3. Шукаємо існуючу оцінку через специфічний метод репозиторію
        var existingRating = await _ratingRepository.GetByUserAndContentAsync(userId, request.ContentId, ct);

        if (existingRating == null)
        {
            // --- НОВИЙ ГОЛОС ---
            float totalPoints = content.Rating * content.VotesCount;
            content.VotesCount++;
            content.Rating = (totalPoints + request.Value) / content.VotesCount;

            var newRating = new UserRating
            {
                UserId = userId,
                ContentId = request.ContentId,
                Value = request.Value
            };

            await _ratingRepository.AddAsync(newRating, ct);
        }
        else
        {
            // --- ОНОВЛЕННЯ ОЦІНКИ ---
            float totalPointsWithoutOld = (content.Rating * content.VotesCount) - existingRating.Value;
            content.Rating = (totalPointsWithoutOld + request.Value) / content.VotesCount;

            existingRating.Value = request.Value;
            await _ratingRepository.UpdateAsync(existingRating, ct);
        }

        // 4. Оновлюємо контент з новим кешованим рейтингом
        await _contentRepository.UpdateAsync(content, ct);

        return Unit.Value;
    }
}