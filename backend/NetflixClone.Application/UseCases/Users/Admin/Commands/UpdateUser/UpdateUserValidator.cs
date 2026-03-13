using FluentValidation;
using Microsoft.AspNetCore.Identity;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Users.Admin.Commands.UpdateUser;

public class UpdateUserValidator : AbstractValidator<UpdateUserCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly ISubscriptionPlanRepository _planRepository;

    public UpdateUserValidator(
        IUserRepository userRepository,
        RoleManager<IdentityRole<Guid>> roleManager,
        ISubscriptionPlanRepository planRepository)
    {
        _userRepository = userRepository;
        _roleManager = roleManager;
        _planRepository = planRepository;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID користувача є обов'язковим.");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Ім'я користувача є обов'язковим.")
            .MinimumLength(3).WithMessage("Ім'я користувача має містити мінімум 3 символи.")
            .MaximumLength(50).WithMessage("Ім'я користувача не може бути довшим за 50 символів.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email є обов'язковим.")
            .EmailAddress().WithMessage("Некоректний формат Email.")
            .MustAsync(async (command, email, ct) =>
                !await _userRepository.ExistsByEmailAsync(email, command.Id, ct))
            .WithMessage("Цей Email вже зайнятий іншим користувачем.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Дата народження є обов'язковою.")
            .Must(date => date < DateOnly.FromDateTime(DateTime.Today))
            .WithMessage("Дата народження не може бути в майбутньому.")
            .Must(date => date > DateOnly.FromDateTime(DateTime.Today.AddYears(-120)))
            .WithMessage("Вказано некоректну дату народження.");

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
    }
}