using MediatR;

namespace NetflixClone.Application.UseCases.Contents.Commands.DeleteContent;

public class DeleteContentCommand : IRequest
{
    public Guid Id { get; set; }
}
