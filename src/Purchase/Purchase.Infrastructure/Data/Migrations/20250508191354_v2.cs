using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Purchase.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shippings_ShippingProviders_ShippingProviderId",
                table: "Shippings");

            migrationBuilder.DropIndex(
                name: "IX_Shippings_ShippingProviderId",
                table: "Shippings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Shippings_ShippingProviderId",
                table: "Shippings",
                column: "ShippingProviderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shippings_ShippingProviders_ShippingProviderId",
                table: "Shippings",
                column: "ShippingProviderId",
                principalTable: "ShippingProviders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
