using MediatR;

namespace NetflixClone.Application.UseCases.Contents.Commands.SetContentRating;

public class SetContentRatingCommand : IRequest<Unit>
{
    public Guid ContentId { get; set; }
    public int Value { get; set; }
}