using MediatR;
using Microsoft.AspNetCore.Http;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Application.UseCases.Contents.Commands.UpdateContent;

public class UpdateContentCommand : IRequest
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IFormFile? NewPosterFile { get; set; }
    public IFormFile? NewDetailsPosterFile { get; set; }
    public IFormFile? NewVideoFile { get; set; }
    public string TrailerUrl { get; set; } = string.Empty;
    public int? Duration { get; set; }
    public decimal Rating { get; set; }
    public int AgeLimit { get; set; }
    public int ReleaseYear { get; set; }
    public int OrderInFranchise { get; set; }
    public Guid? FranchiseId { get; set; }
    public List<Guid> GenreIds { get; set; } = new();
    public List<Guid> CollectionIds { get; set; } = new();
}