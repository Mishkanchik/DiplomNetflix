using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContentById;

public class GetContentByIdHandler : IRequestHandler<GetContentByIdQuery, ContentDetailDto>
{
    private readonly IContentRepository _contentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetContentByIdHandler(
        IContentRepository contentRepository,
        IUserRepository userRepository,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor)
    {
        _contentRepository = contentRepository;
        _userRepository = userRepository;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ContentDetailDto> Handle(GetContentByIdQuery request, CancellationToken ct)
    {
        var content = await _contentRepository.GetByIdWithDetailsAsync(request.Id, ct);
        if (content == null) throw new KeyNotFoundException();

        var dto = _mapper.Map<ContentDetailDto>(content);

        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (Guid.TryParse(userIdClaim, out Guid userId))
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user != null)
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                int age = today.Year - user.DateOfBirth.Year;
                if (user.DateOfBirth > today.AddYears(-age)) age--;

                dto.CanWatch = age >= content.AgeLimit;

                if (!dto.CanWatch)
                {
                    dto.FullVideoUrl = null;
                }
            }
        }

        if (content.Type != NetflixClone.Domain.Enums.ContentType.Series)
        {
            dto.Episodes = new List<EpisodeDto>();
        }

        return dto;
    }
}