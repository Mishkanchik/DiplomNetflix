namespace NetflixClone.Application.UseCases.Users.Profile.Queries;

public class UserProfileDto
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public string? ActiveSubscriptionPlan { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
}
