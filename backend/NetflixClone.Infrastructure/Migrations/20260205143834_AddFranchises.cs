using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NetflixClone.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFranchises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Seasons_SeasonId",
                table: "Episodes");

            migrationBuilder.DropTable(
                name: "Seasons");

            migrationBuilder.DropColumn(
                name: "FullVideoUrl",
                table: "Episodes");

            migrationBuilder.RenameColumn(
                name: "SeasonId",
                table: "Episodes",
                newName: "ContentId");

            migrationBuilder.RenameColumn(
                name: "Number",
                table: "Episodes",
                newName: "EpisodeNumber");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Episodes",
                newName: "DurationInMinutes");

            migrationBuilder.RenameIndex(
                name: "IX_Episodes_SeasonId",
                table: "Episodes",
                newName: "IX_Episodes_ContentId");

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "Episodes",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DurationInMinutes",
                table: "Contents",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FranchiseId",
                table: "Contents",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrderInFranchise",
                table: "Contents",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Franchises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Franchises", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contents_FranchiseId",
                table: "Contents",
                column: "FranchiseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contents_Franchises_FranchiseId",
                table: "Contents",
                column: "FranchiseId",
                principalTable: "Franchises",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Contents_ContentId",
                table: "Episodes",
                column: "ContentId",
                principalTable: "Contents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contents_Franchises_FranchiseId",
                table: "Contents");

            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Contents_ContentId",
                table: "Episodes");

            migrationBuilder.DropTable(
                name: "Franchises");

            migrationBuilder.DropIndex(
                name: "IX_Contents_FranchiseId",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "DurationInMinutes",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "FranchiseId",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "OrderInFranchise",
                table: "Contents");

            migrationBuilder.RenameColumn(
                name: "EpisodeNumber",
                table: "Episodes",
                newName: "Number");

            migrationBuilder.RenameColumn(
                name: "DurationInMinutes",
                table: "Episodes",
                newName: "Duration");

            migrationBuilder.RenameColumn(
                name: "ContentId",
                table: "Episodes",
                newName: "SeasonId");

            migrationBuilder.RenameIndex(
                name: "IX_Episodes_ContentId",
                table: "Episodes",
                newName: "IX_Episodes_SeasonId");

            migrationBuilder.AddColumn<string>(
                name: "FullVideoUrl",
                table: "Episodes",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Seasons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Number = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seasons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Seasons_Contents_ContentId",
                        column: x => x.ContentId,
                        principalTable: "Contents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_ContentId",
                table: "Seasons",
                column: "ContentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Seasons_SeasonId",
                table: "Episodes",
                column: "SeasonId",
                principalTable: "Seasons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
