using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace vmsapi.Migrations
{
    /// <inheritdoc />
    public partial class AddVisitorRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VisitorRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DateTimeCreated = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    VisitDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Expiry = table.Column<TimeSpan>(type: "time", nullable: false),
                    VisitorName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    VehiclePlateNumber = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    UUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitorRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VisitorRequests_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VisitorRequests_UserId",
                table: "VisitorRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorRequests_UUID",
                table: "VisitorRequests",
                column: "UUID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VisitorRequests");
        }
    }
}
