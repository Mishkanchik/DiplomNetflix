using NetflixClone.Domain.Common;

namespace NetflixClone.Domain.Entities;

public class Collection : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public virtual ICollection<Content> Contents { get; set; } = new List<Content>();
}
