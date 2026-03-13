using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Infrastructure.Persistence.Configurations;

public class SubscriptionPlanConfiguration : IEntityTypeConfiguration<SubscriptionPlan>
{
    public void Configure(EntityTypeBuilder<SubscriptionPlan> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(50);

        builder.Property(p => p.Price).HasPrecision(18, 2);

        builder.Property(p => p.Quality).HasMaxLength(10).HasDefaultValue("HD");
        builder.Property(p => p.MaxDevices).HasDefaultValue(1);
    }
}
