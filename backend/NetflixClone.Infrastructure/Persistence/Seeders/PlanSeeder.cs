using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Infrastructure.Persistence.Seeders.Data;

namespace NetflixClone.Infrastructure.Persistence.Seeders;

public static class PlanSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.SubscriptionPlans.AnyAsync()) return;

        var plans = new List<SubscriptionPlan>
        {
            new()
            {
                Name = SubscriptionPlanData.Basic.Name,
                Price = SubscriptionPlanData.Basic.Price,
                Quality = SubscriptionPlanData.Basic.Quality,
                MaxDevices = SubscriptionPlanData.Basic.MaxDevices
            },
            new()
            {
                Name = SubscriptionPlanData.Standard.Name,
                Price = SubscriptionPlanData.Standard.Price,
                Quality = SubscriptionPlanData.Standard.Quality,
                MaxDevices = SubscriptionPlanData.Standard.MaxDevices
            },
            new()
            {
                Name = SubscriptionPlanData.Premium.Name,
                Price = SubscriptionPlanData.Premium.Price,
                Quality = SubscriptionPlanData.Premium.Quality,
                MaxDevices = SubscriptionPlanData.Premium.MaxDevices
            }
        };

        await context.SubscriptionPlans.AddRangeAsync(plans);
        await context.SaveChangesAsync();
    }
}