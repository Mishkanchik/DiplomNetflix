using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Infrastructure.Persistence.Configurations;

public class ContentConfiguration : IEntityTypeConfiguration<Content>
{
    public void Configure(EntityTypeBuilder<Content> builder)
    {
        builder.ToTable("Contents");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Description)
            .HasMaxLength(2000);

        builder.Property(c => c.Rating)
            .IsRequired()
            .HasDefaultValue(0.0f);

        builder.Property(c => c.VotesCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(c => c.Type)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasMany(c => c.UserRatings)
            .WithOne(r => r.Content)
            .HasForeignKey(r => r.ContentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.Collections)
            .WithMany(col => col.Contents);

        builder.HasMany(c => c.Genres)
            .WithMany(g => g.Contents)
            .UsingEntity(j => j.ToTable("ContentGenres"));

        builder.Property(c => c.OrderInFranchise)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(c => c.Duration)
            .IsRequired(false);

        builder.HasOne(c => c.Franchise)
            .WithMany(f => f.Contents)
            .HasForeignKey(c => c.FranchiseId);
    }
}