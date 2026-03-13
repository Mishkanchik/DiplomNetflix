using NetflixClone.Domain.Common;

namespace NetflixClone.Domain.Entities;

public class Favorite : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid ContentId { get; set; }
    public Content Content { get; set; } = null!;
}