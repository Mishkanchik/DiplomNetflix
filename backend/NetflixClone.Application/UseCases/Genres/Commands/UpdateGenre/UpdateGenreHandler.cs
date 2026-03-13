using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Genres.Commands.UpdateGenre;

public class UpdateGenreHandler : IRequestHandler<UpdateGenreCommand>
{
    private readonly IGenreRepository _genreRepository;

    public UpdateGenreHandler(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task Handle(UpdateGenreCommand request, CancellationToken ct)
    {
        var genre = await _genreRepository.GetByIdAsync(request.Id, ct);

        if (genre == null)
        {
            throw new Exception("Жанр не знайдено.");
        }

        genre.Name = request.Name;

        await _genreRepository.UpdateAsync(genre, ct);
    }
}