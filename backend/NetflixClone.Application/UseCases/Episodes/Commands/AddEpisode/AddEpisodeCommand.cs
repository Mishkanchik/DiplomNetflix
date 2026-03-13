using MediatR;
using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.UseCases.Episodes.Commands.AddEpisode;

public class AddEpisodeCommand : IRequest<Guid>
{
    public Guid ContentId { get; set; }
    public int Number { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public int Duration { get; set; }

    public IFormFile VideoFile { get; set; } = null!;
}