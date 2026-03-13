using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Users.Admin.Commands.CreateUser;
using NetflixClone.Application.UseCases.Users.Admin.Commands.DeleteUser;
using NetflixClone.Application.UseCases.Users.Admin.Commands.UpdateUser;
using NetflixClone.Application.UseCases.Users.Admin.Queries.GetAllUsers;
using NetflixClone.Application.UseCases.Users.Admin.Queries.GetUserById;
using NetflixClone.Application.UseCases.Users.Admin.Queries;

[ApiController]
[Route("api/users/admin")]
//[Authorize(Roles = "Admin")] 
public class AdminUsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminUsersController(IMediator mediator) => _mediator = mediator;

    [HttpGet("get-all")]
    public async Task<ActionResult<List<UserAdminDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllUsersQuery());
        return Ok(result);
    }

    [HttpGet("get-user/{id}")]
    public async Task<ActionResult<UserAdminDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetUserByIdQuery { Id = id });
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPost("create")]
    public async Task<ActionResult<Guid>> Create([FromForm] CreateUserCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result }, result);
    }

    [HttpPut("update/{id}")] 
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateUserCommand command)
    {
        command.Id = id;
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteUserCommand { Id = id });
        return NoContent();
    }
}