using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Infrastructure.Persistence.Seeders.Data;

namespace NetflixClone.Infrastructure.Persistence.Seeders;

public static class UserSeeder
{
    public static async Task SeedAsync(UserManager<User> userManager, ApplicationDbContext context)
    {
        var admin = await SeedAdmin(userManager);
        var user = await SeedUser(userManager);

        if (admin != null)
            await EnsureSubscription(admin.Id, SubscriptionPlanData.Premium.Name, context);

        if (user != null)
            await EnsureSubscription(user.Id, SubscriptionPlanData.Standard.Name, context);
    }

    private static async Task<User?> SeedAdmin(UserManager<User> userManager)
    {
        var admin = await userManager.FindByEmailAsync(UserData.Admin.Email);

        if (admin == null)
        {
            admin = new User
            {
                UserName = UserData.Admin.UserName,
                Email = UserData.Admin.Email,
                DateOfBirth = new DateOnly(1990, 1, 1),
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, UserData.Admin.Password);
            if (!result.Succeeded)
            {

                return null;
            }

            await userManager.AddToRoleAsync(admin, RoleData.Admin);
        }
        return admin;
    }

    private static async Task<User?> SeedUser(UserManager<User> userManager)
    {
        var user = await userManager.FindByEmailAsync(UserData.TestUser.Email);

        if (user == null)
        {
            user = new User
            {
                UserName = UserData.TestUser.UserName,
                Email = UserData.TestUser.Email,
                DateOfBirth = new DateOnly(1990, 1, 1),
                EmailConfirmed = true,
                AvatarUrl = ""
            };

            var result = await userManager.CreateAsync(user, UserData.TestUser.Password);
            if (!result.Succeeded)
            {
                return null;
            }

            await userManager.AddToRoleAsync(user, RoleData.User);
        }
        return user;
    }

    private static async Task EnsureSubscription(Guid userId, string planName, ApplicationDbContext context)
    {
        var hasSubscription = await context.UserSubscriptions.AnyAsync(s => s.UserId == userId);

        if (!hasSubscription)
        {
            var plan = await context.SubscriptionPlans.FirstOrDefaultAsync(p => p.Name == planName);

            if (plan != null)
            {
                var subscription = new UserSubscription
                {
                    UserId = userId,
                    PlanId = plan.Id,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(UserData.Technical.DefaultSubscriptionDays),
                    IsAutoRenew = true,
                    PaymentProviderTransactionId = UserData.Technical.MockTransactionId
                };

                await context.UserSubscriptions.AddAsync(subscription);
                await context.SaveChangesAsync();
            }
        }
    }
}