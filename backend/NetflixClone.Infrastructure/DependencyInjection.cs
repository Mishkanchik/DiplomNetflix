using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using NetflixClone.Application.Interfaces;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;
using NetflixClone.Infrastructure.Persistence;
using NetflixClone.Infrastructure.Persistence.Interceptors;
using NetflixClone.Infrastructure.Persistence.Repositories;
using NetflixClone.Infrastructure.Persistence.Repositoriesl;
using NetflixClone.Infrastructure.Repositories;
using NetflixClone.Infrastructure.Services;
using System.Text;
using Hangfire.PostgreSql;

namespace NetflixClone.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<UpdateAuditableInterceptor>();

        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            var auditableInterceptor = sp.GetRequiredService<UpdateAuditableInterceptor>();

            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .AddInterceptors(auditableInterceptor);
        });

        services.AddIdentity<User, IdentityRole<Guid>>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["JwtSettings:Issuer"],
                ValidAudience = configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(configuration["JwtSettings:Secret"]!)),
                ClockSkew = TimeSpan.Zero
            };

            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtAuth");
                    logger.LogError($"Помилка аутентифікації: {context.Exception.Message}");
                    return Task.CompletedTask;
                },
                OnTokenValidated = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtAuth");
                    logger.LogInformation("Токен успішно пройшов валідацію!");
                    return Task.CompletedTask;
                }
            };
        });

        services.AddHangfire(config => config
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(options =>
            {
                // Використовуємо твою рядок підключення з appsettings.json
                options.UseNpgsqlConnection(configuration.GetConnectionString("DefaultConnection"));
            }));

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IVideoService, VideoService>();
        services.AddScoped<ISmtpService, SmtpService>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
        services.AddScoped<ISubscriptionPlanRepository, SubscriptionPlanRepository>();
        services.AddScoped<ICollectionRepository, CollectionRepository>();
        services.AddScoped<IGenreRepository, GenreRepository>();
        services.AddScoped<IFranchiseRepository, FranchiseRepository>();
        services.AddScoped<IContentRepository, ContentRepository>();
        services.AddScoped<IEpisodeRepository, EpisodeRepository>();
        services.AddScoped<IWatchlistRepository, WatchlistRepository>();
        services.AddScoped<IUserRatingRepository, UserRatingRepository>();
        services.AddScoped<IFavoriteRepository, FavoriteRepository>();

        services.AddHangfireServer();

        return services;
    }
}