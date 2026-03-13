using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using NetflixClone.Domain.Entities;
using NetflixClone.Infrastructure.Persistence.Seeders;

namespace NetflixClone.Infrastructure.Persistence;

public class DbInitializer
{
    public static async Task SeedData(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        await RoleSeeder.SeedAsync(roleManager);

        await PlanSeeder.SeedAsync(context);

        await UserSeeder.SeedAsync(userManager, context);

        await CollectionSeeder.SeedAsync(context);

        await GenreSeeder.SeedAsync(context);

        await FranchiseSeeder.SeedAsync(context);
    }
}