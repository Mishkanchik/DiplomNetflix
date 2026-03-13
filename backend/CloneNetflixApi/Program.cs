using CloneNetflix.API.Middleware;
using CloneNetflix.API;
using NetflixClone.Application;
using NetflixClone.Infrastructure;
using NetflixClone.Infrastructure.Persistence;
using Hangfire;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddPresentation(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
var app = builder.Build();

await DbInitializer.SeedData(app.Services);

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHangfireDashboard();
}

app.UseCors("AllowAll");

app.UseStaticFiles();

app.UseMediaStaticFiles(app.Configuration);

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();