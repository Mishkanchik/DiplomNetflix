namespace NetflixClone.Infrastructure.Persistence.Seeders.Data;

public static class UserData
{
    public static class Admin
    {
        public const string UserName = "admin";
        public const string Email = "admin@gmail.com";
        public const string Password = "Admin123";
    }

    public static class TestUser
    {
        public const string UserName = "user";
        public const string Email = "user@gmail.com";
        public const string Password = "User123";
    }

    public static class Technical
    {
        public const string MockTransactionId = "SEED_MOCK_TRANSACTION";
        public const int DefaultSubscriptionDays = 30;
    }
}
