using MediatR;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Favorite.Commands.AddToFavorite;
using NetflixClone.Application.UseCases.Favorite.Commands.RemoveFromFavorite;
using NetflixClone.Application.UseCases.Favorite.Queries.GetFavorites;

namespace CloneNetflix.API.Controllers;

[ApiController]
[Route("api/favorites")]
public class FavoritesController : ControllerBase
{
    private readonly IMediator _mediator;

    public FavoritesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get/{userId:guid}")]
    public async Task<ActionResult<List<FavoriteDto>>> GetFavorites(Guid userId, CancellationToken ct = default)
    {
        var query = new GetFavoritesQuery { UserId = userId };
        var result = await _mediator.Send(query, ct);
        return Ok(result);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Guid>> AddToFavorites([FromBody] AddToFavoriteCommand command, CancellationToken ct = default)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetFavorites), new { userId = command.UserId }, result);
    }

    [HttpDelete("remove/{favoriteId:guid}")]
    public async Task<IActionResult> RemoveFromFavorites(Guid favoriteId, [FromQuery] Guid userId, CancellationToken ct = default)
    {
        var command = new RemoveFromFavoriteCommand { FavoriteId = favoriteId, UserId = userId };
        await _mediator.Send(command, ct);
        return NoContent();
    }
}