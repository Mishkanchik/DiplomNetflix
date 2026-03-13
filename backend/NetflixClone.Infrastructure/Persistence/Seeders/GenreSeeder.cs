using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;
using NetflixClone.Infrastructure.Persistence.Seeders.Data;

namespace NetflixClone.Infrastructure.Persistence.Seeders;

public static class GenreSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Genres.AnyAsync())
        {
            return;
        }

        var genres = GenreData.Names.Select(name => new Genre
        {
            Id = Guid.NewGuid(),
            Name = name
        }).ToList();

        await context.Genres.AddRangeAsync(genres);
        await context.SaveChangesAsync();
    }
}