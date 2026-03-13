using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Infrastructure.Persistence.Seeders.Data;

namespace NetflixClone.Infrastructure.Persistence.Seeders;

public static class CollectionSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Collections.AnyAsync()) return;

        var collections = CollectionData.Names
            .Select(name => new Collection { Name = name })
            .ToList();

        await context.Collections.AddRangeAsync(collections);
        await context.SaveChangesAsync();
    }
}