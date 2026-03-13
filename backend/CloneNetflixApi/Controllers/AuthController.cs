using AutoMapper;
using CloneNetflix.API.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NetflixClone.Application.Interfaces;
using NetflixClone.Application.UseCases.Auth.Commands.ForgotPassword;
using NetflixClone.Application.UseCases.Auth.Commands.Login;
using NetflixClone.Application.UseCases.Auth.Commands.Register;
using NetflixClone.Application.UseCases.Auth.Commands.ResetPassword;
using NetflixClone.Domain.Entities;
using Google.Apis.Auth;
using Microsoft.Extensions.Logging;

namespace CloneNetflix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IMediator mediator,
        UserManager<User> userManager,
        IJwtTokenGenerator jwtTokenGenerator,
        ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _userManager = userManager;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        bool result = await _mediator.Send(command);
        if (result) return Ok();

        return BadRequest(new
        {
            Status = 400,
            Errors = new { Email = "Користувача з такою поштою не існує" }
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        bool result = await _mediator.Send(command);
        if (result) return Ok();

        return BadRequest(new
        {
            Status = 400,
            Errors = new { Message = "Не вдалося змінити пароль. Перевірте токен." }
        });
    }

    [HttpPost("GoogleLogin")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestModel model)
    {
        if (model == null || string.IsNullOrWhiteSpace(model.Token))
            return BadRequest(new { message = "Токен відсутній" });

        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                // Використовуй свій Client ID з Google Cloud Console
                Audience = new[] { "173960592807-uq3f6o1577k4207iqj4861uccskmtjl3.apps.googleusercontent.com" }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(model.Token, settings);

            if (!payload.EmailVerified)
                return BadRequest(new { message = "Email не підтверджено в Google" });

            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user != null)
            {
                // КРИТИЧНО: Перевірка на блокування
                if (user.IsBlocked)
                    return BadRequest(new { message = "Акаунт заблоковано адміністратором." });

                var loginInfo = await _userManager.FindByLoginAsync("Google", payload.Subject);
                if (loginInfo == null)
                {
                    await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", payload.Subject, "Google"));
                }

                var roles = await _userManager.GetRolesAsync(user);
                var jwt = _jwtTokenGenerator.GenerateToken(user, roles);

                return Ok(new { token = jwt });
            }

            // РЕЄСТРАЦІЯ НОВОГО ЮЗЕРА ЧЕРЕЗ GOOGLE
            user = new User
            {
                Email = payload.Email,
                UserName = payload.Email.Split('@')[0], // Робимо "гарне" ім'я без @gmail.com
                EmailConfirmed = true,
                AvatarUrl = payload.Picture, // Забираємо аватарку відразу
                DateOfBirth = new DateOnly(2000, 1, 1) // Дефолтна дата для AgeLimit
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded) return BadRequest(createResult.Errors);

            await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", payload.Subject, "Google"));
            await _userManager.AddToRoleAsync(user, "User");

            var rolesNew = await _userManager.GetRolesAsync(user);
            var jwtNew = _jwtTokenGenerator.GenerateToken(user, rolesNew);

            return Ok(new { token = jwtNew });
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Спроба входу з невалідним Google токеном");
            return BadRequest(new { message = "Невалідний токен Google" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Помилка при Google Login");
            return StatusCode(500, new { message = "Внутрішня помилка сервера" });
        }
    }
}