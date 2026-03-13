using NetflixClone.Domain.Common;
using NetflixClone.Domain.Entities;

public class UserRating : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public Guid ContentId { get; set; }
    public virtual Content Content { get; set; } = null!;

    public int Value { get; set; }
}