using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using NetflixClone.Domain.Common;

namespace NetflixClone.Infrastructure.Persistence.Interceptors;

/*
 * ПОЯСНЕННЯ ДЛЯ КОМАНДИ:
 * * ЩО ЦЕ: Це "перехоплювач" (Interceptor) для Entity Framework Core. 
 * Він працює як Middleware, але для бази даних.
 * * НАВІЩО: Ми винесли сюди логіку автоматичного аудиту (CreatedAt / UpdatedAt). 
 * Тепер нам НЕ потрібно вручну прописувати дати в репозиторіях чи в самому ApplicationDbContext.
 * * ЯК ПРАЦЮЄ: 
 * 1. Коли викликається метод SaveChanges/SaveChangesAsync, EF Core автоматично заходить сюди.
 * 2. Метод UpdateEntities сканує "кошик змін" (ChangeTracker).
 * 3. Якщо він знаходить сутності, що реалізують інтерфейс IAuditableEntity, він автоматично:
 * - Ставить дату створення (якщо це новий запис).
 * - Оновлює дату зміни (якщо запис редагувався).
 * * ПЕРЕВАГИ: ApplicationDbContext тепер чистий (тільки таблиці), а логіка аудиту 
 * централізована в одному місці.
 */

public class UpdateAuditableInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken ct = default)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, ct);
    }

    private void UpdateEntities(DbContext? context) 
    {
        if (context == null) return;

        var entries = context.ChangeTracker.Entries<IAuditableEntity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            var now = DateTime.UtcNow;
            entry.Entity.UpdatedAt = now;
            if (entry.State == EntityState.Added) entry.Entity.CreatedAt = now;
        }
    }
}