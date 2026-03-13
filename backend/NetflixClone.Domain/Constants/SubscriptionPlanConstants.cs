namespace NetflixClone.Domain.Constants;

public static class SubscriptionPlanConstants
{
    public static class Basic
    {
        public const string Name = "Basic";
        public const decimal Price = 149.99m;
        public const string Quality = "SD";
        public const int MaxDevices = 1;
    }

    public static class Standard
    {
        public const string Name = "Standard";
        public const decimal Price = 249.99m;
        public const string Quality = "HD";
        public const int MaxDevices = 2;
    }

    public static class Premium
    {
        public const string Name = "Premium";
        public const decimal Price = 349.99m;
        public const string Quality = "4K";
        public const int MaxDevices = 4;
    }
}
