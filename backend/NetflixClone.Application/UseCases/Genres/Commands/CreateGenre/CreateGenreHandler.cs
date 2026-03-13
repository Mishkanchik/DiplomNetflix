using MediatR;
using NetflixClone.Domain.Entities;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Genres.Commands.CreateGenre;

public class CreateGenreHandler : IRequestHandler<CreateGenreCommand, Guid>
{
    private readonly IGenreRepository _genreRepository;

    public CreateGenreHandler(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<Guid> Handle(CreateGenreCommand request, CancellationToken ct)
    {
        var genre = new Genre
        {
            Name = request.Name
        };

        await _genreRepository.AddAsync(genre, ct);

        return genre.Id;
    }
}