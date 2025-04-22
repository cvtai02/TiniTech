using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class v4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_VariantMetrics_VariantId",
                table: "VariantMetrics");

            migrationBuilder.DropColumn(
                name: "ProductAttributeValueId",
                table: "VariantAttributes");

            migrationBuilder.RenameColumn(
                name: "SKU",
                table: "Variants",
                newName: "Sku");

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "VariantAttributes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariantMetrics_VariantId",
                table: "VariantMetrics",
                column: "VariantId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_VariantMetrics_VariantId",
                table: "VariantMetrics");

            migrationBuilder.RenameColumn(
                name: "Sku",
                table: "Variants",
                newName: "SKU");

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "VariantAttributes",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "ProductAttributeValueId",
                table: "VariantAttributes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_VariantMetrics_VariantId",
                table: "VariantMetrics",
                column: "VariantId");
        }
    }
}
