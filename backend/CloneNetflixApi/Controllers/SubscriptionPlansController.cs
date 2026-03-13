using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.SubscriptionPlans.Commands.CreatePlan;
using NetflixClone.Application.UseCases.SubscriptionPlans.Commands.DeletePlan;
using NetflixClone.Application.UseCases.SubscriptionPlans.Commands.UpdatePlan;
using NetflixClone.Application.UseCases.SubscriptionPlans.Queries;
using NetflixClone.Application.UseCases.SubscriptionPlans.Queries.GetAllPlans;
using NetflixClone.Application.UseCases.SubscriptionPlans.Queries.GetPlanById;

namespace NetflixClone.Api.Controllers;

[ApiController]
[Route("api/plans")]
//[Authorize(Roles = "Admin")] 

public class PlansController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlansController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-all")]
    public async Task<ActionResult<List<SubscriptionPlanDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllSubscriptionPlansQuery());
        return Ok(result);
    }

    [HttpGet("get/{id}")]
    public async Task<ActionResult<SubscriptionPlanDto>> GetById(Guid id)
    {
        var query = new GetSubscriptionPlanByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateSubscriptionPlanCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSubscriptionPlanCommand command)
    {
        command.Id = id;
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteSubscriptionPlanCommand { Id = id };
        await _mediator.Send(command);
        return NoContent();
    }
}