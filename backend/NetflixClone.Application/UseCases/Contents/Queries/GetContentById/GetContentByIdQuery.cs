using MediatR;

namespace NetflixClone.Application.UseCases.Contents.Queries.GetContentById;

public class GetContentByIdQuery : IRequest<ContentDetailDto>
{
    public Guid Id { get; set; }
}