$(document).ready(function () {
    // Handle quantity increase
    $(document).on("click", ".increase-quantity", function () {
        const productId = $(this).data("product-id");
        const variantId = $(this).data("variant-id");
        const quantityInput = $(this).siblings(".quantity-input");
        const currentQty = parseInt(quantityInput.val());

        // Update cart via AJAX (implement this)
        updateCartItem(productId, variantId, currentQty + 1);
    });

    // Handle quantity decrease
    $(document).on("click", ".decrease-quantity", function () {
        const productId = $(this).data("product-id");
        const variantId = $(this).data("variant-id");
        const quantityInput = $(this).siblings(".quantity-input");
        const currentQty = parseInt(quantityInput.val());

        if (currentQty > 1) {
            // Update cart via AJAX (implement this)
            updateCartItem(productId, variantId, currentQty - 1);
        }
    });

    // Handle item removal
    $(document).on("click", ".remove-item", function () {
        const productId = $(this).data("product-id");
        const variantId = $(this).data("variant-id");

        // Remove from cart via AJAX (implement this)
        removeCartItem(productId, variantId);
    });

    // Placeholder functions - implement these with your actual API endpoints
    function updateCartItem(productId, variantId, quantity) {
        // TODO: Implement API call to update cart
        console.log(
            `Update item: product ${productId}, variant ${variantId}, qty ${quantity}`
        );

        // Reload the page or update the cart UI
        location.reload();
    }

    function removeCartItem(productId, variantId) {
        // TODO: Implement API call to remove item from cart
        console.log(`Remove item: product ${productId}, variant ${variantId}`);

        // Reload the page or update the cart UI
        location.reload();
    }
    
    function increaseQuantity() {
        const input = document.getElementById("quantityInput");
        const maxStock = selectedVariant ? selectedVariant.stock : productStock;
        const currentVal = parseInt(input.value) || 0;
        if (currentVal < maxStock) {
            input.value = currentVal + 1;
        }
    }

    // Promo code handling
    $("#applyPromo").click(function () {
        const promoCode = $("#promoCode").val().trim();
        if (promoCode) {
            // TODO: Implement promo code application
            console.log(`Applying promo code: ${promoCode}`);
            toast("Promo code functionality will be implemented soon.");
        }
    });
});
