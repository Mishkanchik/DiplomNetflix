using MediatR;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Franchises.Commands.CreateFranchise;
using NetflixClone.Application.UseCases.Franchises.Commands.DeleteFranchise;
using NetflixClone.Application.UseCases.Franchises.Commands.UpdateFranchise;
using NetflixClone.Application.UseCases.Franchises.Queries;
using NetflixClone.Application.UseCases.Franchises.Queries.GetFranchiseById;
using NetflixClone.Application.UseCases.Franchises.Queries.GetFranchises;

namespace NetflixClone.WebApi.Controllers;

[ApiController]
[Route("api/franchises/")]
//[Authorize(Roles = "Admin")] 

public class FranchisesController : ControllerBase
{
    private readonly IMediator _mediator;

    public FranchisesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-all")]
    public async Task<ActionResult<List<FranchiseDto>>> GetAll(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetFranchisesQuery(), ct);
        return Ok(result);
    }

    [HttpGet("get/{id:guid}")]
    public async Task<ActionResult<FranchiseDto>> GetById(Guid id, CancellationToken ct)
    {
        var query = new GetFranchiseByIdQuery { Id = id };
        var result = await _mediator.Send(query, ct);
        return Ok(result);
    }

    [HttpPost("create")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateFranchiseCommand command, CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("update/{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFranchiseCommand command, CancellationToken ct)
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
        var query = new DeleteFranchiseCommand { Id = id };
        await _mediator.Send(query, ct);
        return NoContent();
    }
}