using MediatR;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Watchlist.Commands.AddToWatchlist;
using NetflixClone.Application.UseCases.Watchlist.Commands.RemoveFromWatchlist;
using NetflixClone.Application.UseCases.Watchlist.Commands.MarkAsWatched;
using NetflixClone.Application.UseCases.Watchlist.Queries.GetWatchlist;

namespace CloneNetflix.API.Controllers;

[ApiController]
[Route("api/watchlist")]
public class WatchlistController : ControllerBase
{
    private readonly IMediator _mediator;

    public WatchlistController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get/{userId:guid}")]
    public async Task<ActionResult<List<WatchlistDto>>> GetWatchlist(Guid userId, [FromQuery] bool? onlyUnwatched = null, CancellationToken ct = default)
    {
        var query = new GetWatchlistQuery { UserId = userId, OnlyUnwatched = onlyUnwatched };
        var result = await _mediator.Send(query, ct);
        return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Guid>> AddToWatchlist([FromBody] AddToWatchlistCommand command, CancellationToken ct = default)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetWatchlist), new { userId = command.UserId }, result);
    }

    [HttpDelete("remove/{watchlistId:guid}")]
    public async Task<IActionResult> RemoveFromWatchlist(Guid watchlistId, [FromQuery] Guid userId, CancellationToken ct = default)
    {
        var command = new RemoveFromWatchlistCommand { WatchlistId = watchlistId, UserId = userId };
        await _mediator.Send(command, ct);
        return NoContent();
    }

    [HttpPut("mark-as-watched/{watchlistId:guid}")]
    public async Task<IActionResult> MarkAsWatched(Guid watchlistId, [FromQuery] Guid userId, CancellationToken ct = default)
    {
        var command = new MarkAsWatchedCommand { WatchlistId = watchlistId, UserId = userId };
        await _mediator.Send(command, ct);
        return NoContent();
    }
}