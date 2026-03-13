using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Infrastructure.Persistence.Seeders.Data;

namespace NetflixClone.Infrastructure.Persistence.Seeders;

public static class FranchiseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Franchises.AnyAsync())
        {
            return;
        }

        var franchises = FranchiseData.Names.Select(name => new Franchise
        {
            Id = Guid.NewGuid(),
            Name = name
        }).ToList();

        await context.Franchises.AddRangeAsync(franchises);
        await context.SaveChangesAsync();
    }
}