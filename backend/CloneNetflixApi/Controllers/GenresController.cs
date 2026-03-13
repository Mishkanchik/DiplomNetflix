using MediatR;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Collections.Commands.DeleteCollection;
using NetflixClone.Application.UseCases.Collections.Queries.GetCollectionById;
using NetflixClone.Application.UseCases.Genres.Commands.CreateGenre;
using NetflixClone.Application.UseCases.Genres.Commands.DeleteGenre;
using NetflixClone.Application.UseCases.Genres.Commands.UpdateGenre;
using NetflixClone.Application.UseCases.Genres.Queries.GetGenreById;
using NetflixClone.Application.UseCases.Genres.Queries.GetGenres;

namespace NetflixClone.WebApi.Controllers;

[ApiController]
[Route("api/genres")]
//[Authorize(Roles = "Admin")] 

public class GenresController : ControllerBase
{
    private readonly IMediator _mediator;

    public GenresController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-all")]
    public async Task<ActionResult<List<GenreDto>>> GetAll(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetGenresQuery(), ct);
        return Ok(result);
    }

    [HttpGet("get/{id:guid}")]
    public async Task<ActionResult<GenreDto>> GetById(Guid id, CancellationToken ct)
    {
        var command = new GetGenreByIdQuery { Id = id };
        var result = await _mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpPost("create")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateGenreCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("update/{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateGenreCommand command, CancellationToken ct)
    {
        if (id != command.Id)
        {
            return BadRequest("ID у маршруті та у тілі запиту не збігаються.");
        }

        await _mediator.Send(command, ct);
        return NoContent();
    }

    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var query = new DeleteGenreCommand { Id = id };
        await _mediator.Send(query, ct);
        return NoContent();
    }
}