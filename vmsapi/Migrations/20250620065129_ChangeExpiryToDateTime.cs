using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace vmsapi.Migrations
{
    /// <inheritdoc />
    public partial class ChangeExpiryToDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Add a temporary column for the new DateTime expiry
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDateTime",
                table: "VisitorRequests",
                type: "datetime2",
                nullable: true);

            // Step 2: Convert existing TIME values to DateTime by adding them to VisitDateTime
            // This assumes existing TIME values represent durations from VisitDateTime
            migrationBuilder.Sql(@"
                UPDATE VisitorRequests
                SET ExpiryDateTime = DATEADD(SECOND,
                    DATEDIFF(SECOND, '00:00:00', Expiry),
                    VisitDateTime)
                WHERE Expiry IS NOT NULL");

            // Step 3: Drop the old TIME column
            migrationBuilder.DropColumn(
                name: "Expiry",
                table: "VisitorRequests");

            // Step 4: Rename the temporary column to the original name
            migrationBuilder.RenameColumn(
                name: "ExpiryDateTime",
                table: "VisitorRequests",
                newName: "Expiry");

            // Step 5: Make the column NOT NULL
            migrationBuilder.AlterColumn<DateTime>(
                name: "Expiry",
                table: "VisitorRequests",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Step 1: Add a temporary TIME column
            migrationBuilder.AddColumn<TimeSpan>(
                name: "ExpiryTime",
                table: "VisitorRequests",
                type: "time",
                nullable: true);

            // Step 2: Convert DateTime back to TIME (calculate duration from VisitDateTime)
            // Only for values that result in durations less than 24 hours
            migrationBuilder.Sql(@"
                UPDATE VisitorRequests
                SET ExpiryTime = CAST(
                    CASE
                        WHEN DATEDIFF(SECOND, VisitDateTime, Expiry) < 86400
                        THEN DATEADD(SECOND, DATEDIFF(SECOND, VisitDateTime, Expiry), '00:00:00')
                        ELSE '23:59:59'
                    END AS TIME)
                WHERE Expiry IS NOT NULL");

            // Step 3: Drop the DateTime column
            migrationBuilder.DropColumn(
                name: "Expiry",
                table: "VisitorRequests");

            // Step 4: Rename the temporary column
            migrationBuilder.RenameColumn(
                name: "ExpiryTime",
                table: "VisitorRequests",
                newName: "Expiry");

            // Step 5: Make the column NOT NULL
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "Expiry",
                table: "VisitorRequests",
                type: "time",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time",
                oldNullable: true);
        }
    }
}
