using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NetflixClone.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class BlockUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "UserRatings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsBlocked",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_UserRatings_UserId1",
                table: "UserRatings",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRatings_AspNetUsers_UserId1",
                table: "UserRatings",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRatings_AspNetUsers_UserId1",
                table: "UserRatings");

            migrationBuilder.DropIndex(
                name: "IX_UserRatings_UserId1",
                table: "UserRatings");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserRatings");

            migrationBuilder.DropColumn(
                name: "IsBlocked",
                table: "AspNetUsers");
        }
    }
}
