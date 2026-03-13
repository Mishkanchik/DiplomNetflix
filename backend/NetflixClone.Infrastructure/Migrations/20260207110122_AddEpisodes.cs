using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NetflixClone.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEpisodes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Episodes_ContentId",
                table: "Episodes");

            migrationBuilder.RenameColumn(
                name: "EpisodeNumber",
                table: "Episodes",
                newName: "Number");

            migrationBuilder.RenameColumn(
                name: "DurationInMinutes",
                table: "Episodes",
                newName: "Duration");

            migrationBuilder.AlterColumn<string>(
                name: "VideoUrl",
                table: "Episodes",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Episodes",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_ContentId_Number",
                table: "Episodes",
                columns: new[] { "ContentId", "Number" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Episodes_ContentId_Number",
                table: "Episodes");

            migrationBuilder.RenameColumn(
                name: "Number",
                table: "Episodes",
                newName: "EpisodeNumber");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Episodes",
                newName: "DurationInMinutes");

            migrationBuilder.AlterColumn<string>(
                name: "VideoUrl",
                table: "Episodes",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Episodes",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250);

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_ContentId",
                table: "Episodes",
                column: "ContentId");
        }
    }
}
