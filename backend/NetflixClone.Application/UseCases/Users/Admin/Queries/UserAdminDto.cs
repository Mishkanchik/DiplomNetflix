namespace NetflixClone.Application.UseCases.Users.Admin.Queries;

public class UserAdminDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsBlocked { get; set; }
    public List<string> Roles { get; set; } = new();
    public string? ActiveSubscriptionPlan { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
}