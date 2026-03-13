using MediatR;

namespace NetflixClone.Application.UseCases.Collections.Commands.CreateCollection;

public class CreateCollectionCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
}
