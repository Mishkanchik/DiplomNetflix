using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NetflixClone.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SynchronizeEpisodePropertyNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VideoUrl",
                table: "Episodes",
                newName: "FullVideoUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FullVideoUrl",
                table: "Episodes",
                newName: "VideoUrl");
        }
    }
}
