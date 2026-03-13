using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.CreateUser;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly UserManager<User> _userManager;
    private readonly IImageService _imageService;
    private readonly IMapper _mapper;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly ISubscriptionPlanRepository _planRepository;

    public CreateUserHandler(
        UserManager<User> userManager,
        IImageService imageService,
        IMapper mapper,
        ISubscriptionRepository subscriptionRepository,
        ISubscriptionPlanRepository planRepository)
    {
        _userManager = userManager;
        _imageService = imageService;
        _mapper = mapper;
        _subscriptionRepository = subscriptionRepository;
        _planRepository = planRepository;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    { 
        var user = _mapper.Map<User>(request);

        if (request.Avatar != null)
        {
            user.AvatarUrl = await _imageService.UploadAsync(
                request.Avatar,
                MediaFolders.Avatars,
                ImageSizeConstants.AvatarWidth,
                ImageSizeConstants.AvatarHeight);
        }

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"User creation failed: {errors}");
        }

        var roles = (request.Roles != null && request.Roles.Any())
            ? request.Roles
            : new List<string> { RoleConstants.User };

        await _userManager.AddToRolesAsync(user, roles);

        Guid planIdToAssign;

        if (request.PlanId.HasValue)
        {
            planIdToAssign = request.PlanId.Value;
        }
        else
        {
            var allPlans = await _planRepository.GetAllAsync(cancellationToken);
            var basicPlan = allPlans.FirstOrDefault(p => p.Name == "Basic");

            if (basicPlan == null)
            {
                throw new Exception("Дефолтний план 'Basic' не знайдено. Перевірте SeedData.");
            }

            planIdToAssign = basicPlan.Id;
        }

        var subscription = _mapper.Map<UserSubscription>(request);
        subscription.UserId = user.Id;
        subscription.PlanId = planIdToAssign;

        await _subscriptionRepository.AddAsync(subscription, cancellationToken);

        return user.Id;
    }
}