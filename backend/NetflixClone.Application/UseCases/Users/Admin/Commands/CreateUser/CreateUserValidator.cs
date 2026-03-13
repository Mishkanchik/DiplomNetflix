using FluentValidation;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.CreateUser;

public class CreateUserValidator : AbstractValidator<CreateUserCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly ISubscriptionPlanRepository _planRepository;

    public CreateUserValidator(
        IUserRepository userRepository,
        RoleManager<IdentityRole<Guid>> roleManager,
        ISubscriptionPlanRepository planRepository)
    {
        _userRepository = userRepository;
        _roleManager = roleManager;
        _planRepository = planRepository;

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Ім'я користувача є обов'язковим.")
            .MinimumLength(3).WithMessage("Ім'я користувача має містити мінімум 3 символи.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email є обов'язковим.")
            .EmailAddress().WithMessage("Некоректний формат Email.")
            .MustAsync(async (email, ct) => !await _userRepository.ExistsByEmailAsync(email, ct))
            .WithMessage("Користувач з таким Email вже існує.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль є обов'язковим.")
            .MinimumLength(6).WithMessage("Пароль має містити мінімум 6 символів.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Паролі не збігаються.");

        RuleFor(x => x.Roles)
            .Must(r => r != null && r.Any()).WithMessage("Потрібно призначити хоча б одну роль.");

        RuleForEach(x => x.Roles)
            .MustAsync(async (roleName, ct) => await _roleManager.RoleExistsAsync(roleName))
            .WithMessage(role => $"Роль '{role}' не знайдена в системі.");

        RuleFor(x => x.PlanId)
            .MustAsync(async (planId, ct) =>
            {
                if (!planId.HasValue) return true;
                var plan = await _planRepository.GetByIdAsync(planId.Value, ct);
                return plan != null;
            })
            .WithMessage("Вказаний план підписки не існує.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Дата народження є обов'язковою.")
            .Must(date => date < DateOnly.FromDateTime(DateTime.Today))
            .WithMessage("Дата народження не може бути в майбутньому.");
    }
}