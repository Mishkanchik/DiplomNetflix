using NetflixClone.Domain.Common;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Domain.Entities;

public class Content : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public string DetailsPosterUrl { get; set; } = string.Empty;
    public string TrailerUrl { get; set; } = string.Empty;
    public string? FullVideoUrl { get; set; }
    public string? OriginalVideoPath { get; set; }
    public int? Duration { get; set; }
    public float Rating { get; set; }
    public int VotesCount { get; set; }
    public virtual ICollection<UserRating> UserRatings { get; set; } = new List<UserRating>();
    public int AgeLimit { get; set; }
    public int ReleaseYear { get; set; }
    public ContentType Type { get; set; }
    public int OrderInFranchise { get; set; }
    public VideoStatus? VideoStatus { get; set; }
    public Guid? FranchiseId { get; set; }
    public virtual Franchise? Franchise { get; set; }
    public virtual ICollection<Collection> Collections { get; set; } = new List<Collection>();
    public virtual ICollection<Genre> Genres { get; set; } = new List<Genre>();
    public virtual ICollection<Episode> Episodes { get; set; } = new List<Episode>();
}