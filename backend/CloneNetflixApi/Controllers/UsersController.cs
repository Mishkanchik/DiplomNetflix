using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.UseCases.Users.Profile.Commands.ChangePassword;
using NetflixClone.Application.UseCases.Users.Profile.Commands.DeleteMyAccount;
using NetflixClone.Application.UseCases.Users.Profile.Commands.UpdateMyProfile;
using NetflixClone.Application.UseCases.Users.Profile.Queries;
using NetflixClone.Application.UseCases.Users.Profile.Queries.GetMyProfile;
using System.Security.Claims;

namespace NetflixClone.Api.Controllers;

[ApiController]
[Route("api/users/profile")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get")]
    public async Task<ActionResult<UserProfileDto>> GetMyProfile()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized(new { Message = "Користувач не авторизований або токен недійсний." });
        }

        var query = new GetMyProfileQuery { UserId = Guid.Parse(userIdString) };

        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateMyProfile([FromForm] UpdateMyProfileCommand command)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

        command.UserId = Guid.Parse(userIdString);
        await _mediator.Send(command);

        return NoContent();
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

        command.UserId = Guid.Parse(userIdString);
        await _mediator.Send(command);

        return Ok(new { Message = "Пароль успішно змінено" });
    }

    [HttpPost("delete-account")]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteMyAccountCommand command)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

        command.UserId = Guid.Parse(userIdString);
        await _mediator.Send(command);

        return NoContent();
    }
}