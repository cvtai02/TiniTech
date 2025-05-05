using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductMetrics_ProductId",
                table: "ProductMetrics");

            migrationBuilder.DropIndex(
                name: "IX_Category_Slug",
                table: "Categories");

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "ProductMetrics",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.CreateIndex(
                name: "IX_ProductMetrics_ProductId",
                table: "ProductMetrics",
                column: "ProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Category_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Category_Slug",
                table: "Categories",
                column: "Slug");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductMetrics_ProductId",
                table: "ProductMetrics");

            migrationBuilder.DropIndex(
                name: "IX_Category_Name",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Category_Slug",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "ProductMetrics");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMetrics_ProductId",
                table: "ProductMetrics",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Category_Slug",
                table: "Categories",
                column: "Slug",
                unique: true);
        }
    }
}
