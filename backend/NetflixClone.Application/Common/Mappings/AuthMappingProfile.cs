using AutoMapper;
using NetflixClone.Application.UseCases.Auth.Commands.Register;
using NetflixClone.Application.UseCases.Auth;
using NetflixClone.Application.UseCases.Users.Admin.Queries;
using NetflixClone.Domain.Entities;
using NetflixClone.Application.UseCases.Users.Admin.Commands.UpdateUser;
using NetflixClone.Application.UseCases.Users.Admin.Commands.CreateUser;
using NetflixClone.Application.UseCases.Users.Profile.Queries;

namespace NetflixClone.Application.Common.Mappings;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        CreateMap<User, AuthResponse>();

        CreateMap<RegisterCommand, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email.Split('@', StringSplitOptions.None)[0]))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Subscriptions, opt => opt.Ignore())
            .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

        CreateMap<RegisterCommand, UserSubscription>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.PlanId, opt => opt.Ignore())
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(_ => DateTime.UtcNow.AddDays(30)))
            .ForMember(dest => dest.IsAutoRenew, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.PaymentProviderTransactionId, opt => opt.MapFrom(_ => "FREE_TRIAL_REGISTRATION"))
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Plan, opt => opt.Ignore());
    }
}