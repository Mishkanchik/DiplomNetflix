//using Microsoft.EntityFrameworkCore;
//using NetflixClone.Domain.Entities;
//using NetflixClone.Domain.Enums;

//namespace NetflixClone.Infrastructure.Persistence.Seeders;

//public static class ContentSeeder
//{
//    public static async Task SeedAsync(ApplicationDbContext context)
//    {
//        if (await context.Contents.AnyAsync()) return;

//        var movieCategory = await context.Categories.FirstAsync(c => c.Name == "Фільми");
//        var seriesCategory = await context.Categories.FirstAsync(c => c.Name == "Серіали");

//        var contentList = new List<Content>
//        {
//            new()
//            {
//                Title = "Інтерстеллар",
//                Description = "Подорож крізь час та простір...",
//                PosterUrl = "/media/posters/interstellar.jpg",
//                TrailerUrl = "https://www.youtube.com/watch?v=zSWdZVtXT7E",
//                FullVideoUrl = "/media/videos/interstellar_full.mp4",
//                Rating = 9.8m,
//                AgeLimit = 12,
//                ReleaseYear = 2014,
//                Type = ContentType.Movie,
//                CategoryId = movieCategory.Id
//            },

//            new()
//            {
//                Title = "Дивні дива",
//                Description = "Таємничі події в містечку Хокінс...",
//                PosterUrl = "/media/posters/stranger_things.jpg",
//                TrailerUrl = "https://www.youtube.com/watch?v=b9EkMc79ZSU",
//                FullVideoUrl = null,
//                Rating = 8.7m,
//                AgeLimit = 16,
//                ReleaseYear = 2016,
//                Type = ContentType.Series,
//                CategoryId = seriesCategory.Id,
//                Seasons = new List<Season>
//                {
//                    new()
//                    {
//                        Number = 1,
//                        Title = "Перший сезон",
//                        Episodes = new List<Episode>
//                        {
//                            new() {
//                                Number = 1,
//                                Title = "Зникнення Вілла Байєрса",
//                                Duration = 50,
//                                FullVideoUrl = "/media/videos/st_s1_e1.mp4"
//                            }
//                        }
//                    }
//                }
//            }
//        };

//        await context.Contents.AddRangeAsync(contentList);
//        await context.SaveChangesAsync();
//    }
//}