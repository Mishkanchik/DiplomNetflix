using MediatR;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Collections.Commands.CreateCollection;
using NetflixClone.Application.UseCases.Collections.Commands.DeleteCollection;
using NetflixClone.Application.UseCases.Collections.Commands.UpdateCollection;
using NetflixClone.Application.UseCases.Collections.Queries;
using NetflixClone.Application.UseCases.Collections.Queries.GetCollections;
using NetflixClone.Application.UseCases.Collections.Queries.GetCollectionById;

namespace NetflixClone.Api.Controllers;

[ApiController]
[Route("api/collections/")]
//[Authorize(Roles = "Admin")] 

public class CollectionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CollectionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-all")]
    public async Task<ActionResult<List<CollectionDto>>> GetAll(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetCollectionsQuery(), ct);
        return Ok(result);
    }

    [HttpGet("get/{id:guid}")]
    public async Task<ActionResult<CollectionDto>> GetById(Guid id, CancellationToken ct)
    {
        var query = new GetCollectionByIdQuery { Id = id };
        var result = await _mediator.Send(query, ct);

        if (result == null) return NotFound();

        return Ok(result);
    }

    [HttpPost("create")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateCollectionCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("update/{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCollectionCommand command, CancellationToken ct)
    {
        if (id != command.Id) return BadRequest("ID у маршруті та у тілі запиту не збігаються.");

        await _mediator.Send(command, ct);
        return NoContent();
    }

    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var command = new DeleteCollectionCommand { Id = id };
        await _mediator.Send(command, ct);
        return NoContent();
    }
}