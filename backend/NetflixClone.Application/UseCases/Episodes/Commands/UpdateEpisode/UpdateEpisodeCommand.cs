using MediatR;
using Microsoft.AspNetCore.Http;

namespace NetflixClone.Application.UseCases.Episodes.Commands.UpdateEpisode;

public class UpdateEpisodeCommand : IRequest
{
    public Guid Id { get; set; }
    public int Number { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public int Duration { get; set; }

    public IFormFile? VideoFile { get; set; }
}