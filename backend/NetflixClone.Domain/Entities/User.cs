using Microsoft.AspNetCore.Identity;
using NetflixClone.Domain.Common;

namespace NetflixClone.Domain.Entities;

// Оскільки немає множиного наслідування прийшлось CreatedAt й UpdatedAt прописати тут. Нададі є базовий клас BaseIdentity
public class User : IdentityUser<Guid>, IAuditableEntity
{
    public DateOnly DateOfBirth { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsBlocked { get; set; } = false;

    // Тут зробив List щоб зберігати дані про транзакції, щоб в користувача був список всіх покупок, а не тільки current 
    public ICollection<UserSubscription> Subscriptions { get; set; } = new List<UserSubscription>();

    // Допоміжна властивість для швидкої перевірки активної підписки
    public UserSubscription? ActiveSubscription => Subscriptions
        .OrderByDescending(s => s.EndDate)
        .FirstOrDefault(s => s.EndDate > DateTime.UtcNow);
    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; } = new List<ApplicationUserRole>();
    public string? AvatarUrl { get; set; }
    public virtual ICollection<UserRating> UserRatings { get; set; } = new List<UserRating>();
}
