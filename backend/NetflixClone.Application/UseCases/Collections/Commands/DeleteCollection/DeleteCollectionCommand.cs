using MediatR;

namespace NetflixClone.Application.UseCases.Collections.Commands.DeleteCollection;

public class DeleteCollectionCommand : IRequest
{
    public Guid Id { get; set; }
}
