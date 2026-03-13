using System.Net;
using System.Text.Json;
using FluentValidation;

namespace CloneNetflix.API.Middleware
{
    //Ловить помилки, не потрібно прописувати try catch в контролерах
    public class ExceptionHandlingMiddleware
    {
        public readonly RequestDelegate _next;
        public readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application.json";

            var statusCode = exception switch
            {
                ValidationException => HttpStatusCode.BadRequest, // 400
                UnauthorizedAccessException => HttpStatusCode.Unauthorized, // 401
                _ => HttpStatusCode.InternalServerError // 500
            };

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                error = exception.Message,
                details = exception is ValidationException vex
                ? vex.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
                : null
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }

    }
}
