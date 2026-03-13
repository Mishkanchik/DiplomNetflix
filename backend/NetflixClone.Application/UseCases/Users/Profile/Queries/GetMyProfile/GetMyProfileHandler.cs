using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Domain.Entities;
using Microsoft.EntityFrameworkCore; // Необхідно для .Include()

namespace NetflixClone.Application.UseCases.Users.Profile.Queries.GetMyProfile;

public class GetMyProfileHandler : IRequestHandler<GetMyProfileQuery, UserProfileDto>
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;

    public GetMyProfileHandler(UserManager<User> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<UserProfileDto> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.Users
            .Include(u => u.Subscriptions)
                .ThenInclude(s => s.Plan)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new Exception("Користувача не знайдено");
        }

        return _mapper.Map<UserProfileDto>(user);
    }
}