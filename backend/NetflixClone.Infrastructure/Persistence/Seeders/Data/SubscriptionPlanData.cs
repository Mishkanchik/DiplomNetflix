using NetflixClone.Domain.Constants;

namespace NetflixClone.Infrastructure.Persistence.Seeders.Data;

public static class SubscriptionPlanData
{
    public static class Basic
    {
        public const string Name = SubscriptionPlanConstants.Basic.Name;
        public const decimal Price = SubscriptionPlanConstants.Basic.Price;
        public const string Quality = SubscriptionPlanConstants.Basic.Quality;
        public const int MaxDevices = SubscriptionPlanConstants.Basic.MaxDevices;
    }

    public static class Standard
    {
        public const string Name = SubscriptionPlanConstants.Standard.Name;
        public const decimal Price = SubscriptionPlanConstants.Standard.Price;
        public const string Quality = SubscriptionPlanConstants.Standard.Quality;
        public const int MaxDevices = SubscriptionPlanConstants.Standard.MaxDevices;
    }

    public static class Premium
    {
        public const string Name = SubscriptionPlanConstants.Premium.Name;
        public const decimal Price = SubscriptionPlanConstants.Premium.Price;
        public const string Quality = SubscriptionPlanConstants.Premium.Quality;
        public const int MaxDevices = SubscriptionPlanConstants.Premium.MaxDevices;
    }
}