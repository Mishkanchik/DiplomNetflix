namespace NetflixClone.Application.UseCases.Watchlist.Queries.GetWatchlist;

public class WatchlistDto
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public decimal Rating { get; set; }
}