using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetflixClone.Application.UseCases.Episodes.Commands.DeleteEpisode
{
    public class DeleteEpisodeCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}
