using NetflixClone.Domain.Common;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Domain.Entities;

public class Episode : BaseEntity
{
    public int Number { get; set; }
    public string Title { get; set; } = string.Empty;

    // Це буде шлях до готового плейлиста .m3u8
    public string? FullVideoUrl { get; set; }

    // Шлях до оригіналу, який завантажив адмін (тимчасовий)
    public string? OriginalVideoPath { get; set; }

    public int Duration { get; set; }
    public VideoStatus VideoStatus { get; set; } = VideoStatus.Pending; //

    public Guid ContentId { get; set; }
    public virtual Content Content { get; set; } = null!;
}