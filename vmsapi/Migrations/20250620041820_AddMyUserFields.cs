using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace vmsapi.Migrations
{
    /// <inheritdoc />
    public partial class AddMyUserFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsResident",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "StreetNo",
                table: "AspNetUsers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UnitNo",
                table: "AspNetUsers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsResident",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "StreetNo",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UnitNo",
                table: "AspNetUsers");
        }
    }
}
