using AutoMapper;
using NetflixClone.Application.UseCases.Users.Admin.Commands.CreateUser;
using NetflixClone.Application.UseCases.Users.Admin.Commands.UpdateUser;
using NetflixClone.Application.UseCases.Users.Admin.Queries;
using NetflixClone.Application.UseCases.Users.Profile.Commands.UpdateMyProfile;
using NetflixClone.Application.UseCases.Users.Profile.Queries;
using NetflixClone.Domain.Entities;

namespace NetflixClone.Application.Common.Mappings;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // 1. КОМАНДИ -> USER (Створення та Оновлення)
        // Використовуємо спільні правила для ігнорування системних полів

        CreateMap<CreateUserCommand, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore()) // Обробляється ImageService
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Обробляється Interceptor
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Обробляється Interceptor
            .ForMember(dest => dest.Subscriptions, opt => opt.Ignore())
            .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

        CreateMap<UpdateUserCommand, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username))
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Не змінюємо PK існуючого юзера
            .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Subscriptions, opt => opt.Ignore())
            .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

        CreateMap<UpdateMyProfileCommand, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore()) // Обробляється ImageService
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Subscriptions, opt => opt.Ignore())
            .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

        // 2. КОМАНДИ -> USER_SUBSCRIPTION
        // Виправляємо помилку 500, додаючи мапінг для створення

        CreateMap<CreateUserCommand, UserSubscription>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(_ => DateTime.UtcNow.AddDays(30)))
            .ForMember(dest => dest.IsAutoRenew, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.PaymentProviderTransactionId, opt => opt.MapFrom(_ => "ADMIN_MANUAL_ASSIGNMENT"))
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Plan, opt => opt.Ignore());

        CreateMap<UpdateUserCommand, UserSubscription>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(_ => DateTime.UtcNow.AddDays(30)))
            .ForMember(dest => dest.IsAutoRenew, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.PaymentProviderTransactionId, opt => opt.MapFrom(_ => "ADMIN_UPDATE_ASSIGNMENT"))
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Plan, opt => opt.Ignore());

        // 3. USER -> DTO (Читання даних для адмінки)

        CreateMap<User, UserAdminDto>()
            // Мапимо ролі зі вкладеної колекції ApplicationUserRole
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src =>
                src.UserRoles.Select(ur => ur.Role.Name).ToList()))
            // Використовуємо вашу допоміжну властивість ActiveSubscription
            .ForMember(dest => dest.ActiveSubscriptionPlan, opt => opt.MapFrom(src =>
                src.ActiveSubscription != null ? src.ActiveSubscription.Plan.Name : "No Active Plan"))
            .ForMember(dest => dest.SubscriptionEndDate, opt => opt.MapFrom(src =>
                src.ActiveSubscription != null ? (DateTime?)src.ActiveSubscription.EndDate : null));

        CreateMap<User, UserProfileDto>()
            .ForMember(dest => dest.ActiveSubscriptionPlan, opt => opt.MapFrom(src =>
                src.ActiveSubscription != null ? src.ActiveSubscription.Plan.Name : "No Active Plan"))
            .ForMember(dest => dest.SubscriptionEndDate, opt => opt.MapFrom(src =>
                src.ActiveSubscription != null ? (DateTime?)src.ActiveSubscription.EndDate : null));
    }
}