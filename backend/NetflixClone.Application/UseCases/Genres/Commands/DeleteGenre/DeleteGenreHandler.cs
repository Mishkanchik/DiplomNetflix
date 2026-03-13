using MediatR;
using NetflixClone.Domain.Interfaces;

namespace NetflixClone.Application.UseCases.Genres.Commands.DeleteGenre;

public class DeleteGenreHandler : IRequestHandler<DeleteGenreCommand>
{
    private readonly IGenreRepository _genreRepository;

    public DeleteGenreHandler(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task Handle(DeleteGenreCommand request, CancellationToken ct)
    {
        var genre = await _genreRepository.GetByIdAsync(request.Id, ct);

        if (genre == null)
        {
            throw new Exception("Жанр не знайдено.");
        }

        await _genreRepository.DeleteAsync(request.Id, ct);
    }
}