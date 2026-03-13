using MediatR;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.Common;
using NetflixClone.Application.UseCases.Contents.Commands.CreateContent;
using NetflixClone.Application.UseCases.Contents.Commands.DeleteContent;
using NetflixClone.Application.UseCases.Contents.Commands.SetContentRating;
using NetflixClone.Application.UseCases.Contents.Commands.UpdateContent;
using NetflixClone.Application.UseCases.Contents.Queries.GetContentById;
using NetflixClone.Application.UseCases.Contents.Queries.GetContents;

namespace NetflixClone.WebApi.Controllers;

[ApiController]
[Route("api/contents/")]
//[Authorize(Roles = "Admin")] 

public class ContentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ContentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult<Guid>> Create([FromForm] CreateContentCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);

        return CreatedAtAction(null, new { id }, id);
    }

    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteContentCommand { Id = id };
        await _mediator.Send(command);

        return NoContent();
    }

    [HttpPut("update/{id:guid}")]
    [Consumes("multipart/form-data")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateContentCommand command, CancellationToken ct)
    {
        if (id != command.Id)
        {
            return BadRequest("ID у маршруті не збігається з ID у тілі запиту.");
        }

        await _mediator.Send(command, ct);

        return NoContent();
    }

    [HttpGet("get")]
    public async Task<ActionResult<PagedResponse<ContentDto>>> GetAll([FromQuery] GetContentsQuery query)
    {
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("get-details/{id:guid}")]
    public async Task<ActionResult<ContentDetailDto>> GetById(Guid id)
    {
        var query = new GetContentByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:guid}/rating")]
    public async Task<IActionResult> SetRating(Guid id, [FromBody] int value)
    {
        var command = new SetContentRatingCommand
        {
            ContentId = id,
            Value = value
        };

        await _mediator.Send(command);

        return NoContent();
    }
}