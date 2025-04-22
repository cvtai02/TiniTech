using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class v5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "ProductMetrics");

            migrationBuilder.AddColumn<int>(
                name: "FeaturedPoint",
                table: "ProductMetrics",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeaturedPoint",
                table: "ProductMetrics");

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "ProductMetrics",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
