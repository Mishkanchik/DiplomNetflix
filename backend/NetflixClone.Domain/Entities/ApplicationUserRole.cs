using Microsoft.AspNetCore.Identity;

namespace NetflixClone.Domain.Entities;

// Спадкуємося від стандартного зв'язку, але додаємо посилання на Роль
public class ApplicationUserRole : IdentityUserRole<Guid>
{
    public virtual IdentityRole<Guid> Role { get; set; }
}