using MediatR;
using NetflixClone.Application.Common;
using NetflixClone.Domain.Enums;

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContents;

public class GetContentsQuery : IRequest<PagedResponse<ContentDto>>
{
    public string? SearchTerm { get; set; }
    public List<Guid>? GenreIds { get; set; } = new();
    public Guid? CollectionId { get; set; }
    public string? SortBy { get; set; }
    public bool IsDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}