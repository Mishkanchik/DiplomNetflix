using MediatR;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Episodes.Commands.AddEpisode;
using NetflixClone.Application.UseCases.Episodes.Commands.DeleteEpisode;
using NetflixClone.Application.UseCases.Episodes.Commands.UpdateEpisode;
using NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodeById;
using NetflixClone.Application.UseCases.Episodes.Queries.GetEpisodesByContentId;

namespace NetflixClone.API.Controllers;

[ApiController]
[Route("api/episodes")]
//[Authorize(Roles = "Admin")] 

public class EpisodesController : ControllerBase
{
    private readonly IMediator _mediator;

    public EpisodesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("add")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [DisableRequestSizeLimit]
    public async Task<ActionResult<Guid>> AddEpisode([FromForm] AddEpisodeCommand command)
    {
        var id = await _mediator.Send(command);

        return CreatedAtAction(null, new { id }, id);
    }

    [HttpDelete("delete/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEpisode(Guid id)
    {
        await _mediator.Send(new DeleteEpisodeCommand { Id = id });

        return NoContent();
    }

    [HttpPut("update/{id:guid}")]
    [Consumes("multipart/form-data")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> UpdateEpisode(Guid id, [FromForm] UpdateEpisodeCommand command)
    {
        if (id != command.Id) return BadRequest("ID mismatch");

        await _mediator.Send(command);
        return NoContent();
    }

    [HttpGet("get-episodes/content-id/{contentId:guid}")]
    public async Task<ActionResult<IEnumerable<EpisodeDto>>> GetEpisodes(Guid contentId)
    {
        var query = new GetEpisodesByContentIdQuery { ContentId = contentId };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("get/{id:guid}")]
    public async Task<ActionResult<EpisodeDto>> GetById(Guid id)
    {
        var query = new GetEpisodeByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}