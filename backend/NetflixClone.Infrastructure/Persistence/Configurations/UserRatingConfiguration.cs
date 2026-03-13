using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Infrastructure.Persistence.Configurations;

public class UserRatingConfiguration : IEntityTypeConfiguration<UserRating>
{
    public void Configure(EntityTypeBuilder<UserRating> builder)
    {
        builder.ToTable("UserRatings");

        builder.HasKey(r => r.Id);

        builder.HasIndex(r => new { r.UserId, r.ContentId })
            .IsUnique();

        builder.Property(r => r.Value)
            .IsRequired();

        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Content)
            .WithMany(c => c.UserRatings)
            .HasForeignKey(r => r.ContentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}