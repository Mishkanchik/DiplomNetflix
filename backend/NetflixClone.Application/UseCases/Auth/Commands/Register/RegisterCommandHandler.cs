using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Constants;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IMapper _mapper;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly ISubscriptionPlanRepository _planRepository;

    public RegisterCommandHandler(
        UserManager<User> userManager,
        IJwtTokenGenerator jwtTokenGenerator,
        IImageService imageService,
        IMapper mapper,
        ISubscriptionRepository subscriptionRepository,
        ISubscriptionPlanRepository planRepository)
    {
        _userManager = userManager;
        _jwtTokenGenerator = jwtTokenGenerator;
        _mapper = mapper;
        _subscriptionRepository = subscriptionRepository;
        _planRepository = planRepository;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // 1. Перевірка паролів
        if (request.Password != request.ConfirmPassword)
            throw new Exception("Passwords do not match");

        var user = _mapper.Map<User>(request);

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Registration failed: {errors}");
        }

        await _userManager.AddToRoleAsync(user, RoleConstants.User);

        var plans = await _planRepository.GetAllAsync(cancellationToken);
        var basicPlan = plans.FirstOrDefault(p => p.Name == SubscriptionPlanConstants.Basic.Name);

        if (basicPlan != null)
        {
            var subscription = _mapper.Map<UserSubscription>(request);
            subscription.UserId = user.Id;
            subscription.PlanId = basicPlan.Id;

            await _subscriptionRepository.AddAsync(subscription, cancellationToken);
        }

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenGenerator.GenerateToken(user, roles);

        var response = _mapper.Map<AuthResponse>(user);
        response.Token = token;

        return response;
    }
}