using MediatR;
using Microsoft.AspNetCore.Http;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Application.UseCases.Contents.Commands.CreateContent;

public class CreateContentCommand : IRequest<Guid>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string TrailerUrl { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public decimal Rating { get; set; }
    public int AgeLimit { get; set; }

    public ContentType Type { get; set; }

    public IFormFile PosterFile { get; set; } = null!;
    public IFormFile DetailsPosterFile { get; set; } = null!;

    public IFormFile? VideoFile { get; set; }
    public int? Duration { get; set; }

    public int OrderInFranchise { get; set; }
    public Guid? FranchiseId { get; set; }
    public List<Guid> GenreIds { get; set; } = new();
    public List<Guid> CollectionIds { get; set; } = new();
}