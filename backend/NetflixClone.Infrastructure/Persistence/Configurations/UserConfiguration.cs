using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("AspNetUsers");

        builder.Ignore(u => u.ActiveSubscription);

        builder.Property(u => u.DateOfBirth).IsRequired();
        builder.Property(u => u.AvatarUrl).HasMaxLength(500);

        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.UpdatedAt).IsRequired(false);

        builder.Property(u => u.IsBlocked)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasMany(u => u.UserRatings)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}