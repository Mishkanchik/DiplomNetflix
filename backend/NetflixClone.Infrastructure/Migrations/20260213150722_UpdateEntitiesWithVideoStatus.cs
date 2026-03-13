using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NetflixClone.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntitiesWithVideoStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OriginalVideoPath",
                table: "Episodes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Episodes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OriginalVideoPath",
                table: "Contents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VideoStatus",
                table: "Contents",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalVideoPath",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "OriginalVideoPath",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "VideoStatus",
                table: "Contents");
        }
    }
}
