using NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContentById;

public class ContentDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public string DetailsPosterUrl { get; set; } = string.Empty;
    public string TrailerUrl { get; set; } = string.Empty;
    public string? FullVideoUrl { get; set; }
    public int? Duration { get; set; }
    public decimal Rating { get; set; }
    public int AgeLimit { get; set; }
    public int ReleaseYear { get; set; }
    public bool CanWatch { get; set; }
    public ContentType Type { get; set; }
    public VideoStatus VideoStatus { get; set; }
    public List<string> Genres { get; set; } = new();
    public List<EpisodeDto> Episodes { get; set; } = new();
}