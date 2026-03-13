using NetflixClone.Domain.Enums;

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContents;

public class ContentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string PosterUrl { get; set; } = null!;
    public float Rating { get; set; }
    public int ReleaseYear { get; set; }
    public VideoStatus VideoStatus { get; set; }
}