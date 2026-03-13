using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Infrastructure.Persistence.Configurations;

public class EpisodeConfiguration : IEntityTypeConfiguration<Episode>
{
    public void Configure(EntityTypeBuilder<Episode> builder)
    {
        builder.ToTable("Episodes");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(e => e.Number)
            .IsRequired();

        // Зв'язок: Content (1) -> Episodes (N)
        builder.HasOne(e => e.Content)
            .WithMany(c => c.Episodes)
            .HasForeignKey(e => e.ContentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Унікальність серії всередині одного контенту (сезону)
        builder.HasIndex(e => new { e.ContentId, e.Number }).IsUnique();
    }
}