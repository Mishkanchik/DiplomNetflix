using Microsoft.AspNetCore.Identity;
using NetflixClone.Infrastructure.Persistence.Seeders.Data;

namespace NetflixClone.Infrastructure.Persistence.Seeders
{
   public static class RoleSeeder
    {
        public static async Task SeedAsync(RoleManager<IdentityRole<Guid>> roleManager)
        {
            string[] roleNames = { RoleData.Admin, RoleData.User };

            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid> (roleName));
                }
            }
        }
    }
}
