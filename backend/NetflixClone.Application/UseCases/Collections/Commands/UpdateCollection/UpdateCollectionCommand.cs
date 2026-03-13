using MediatR;

namespace NetflixClone.Application.UseCases.Collections.Commands.UpdateCollection;

public class UpdateCollectionCommand : IRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
