// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    const hrefs = window.location.href.split("/");

    //remove domain from hrefs
    const hrefsWithoutDomain = hrefs.slice(3);
    if (hrefsWithoutDomain.length > 1) {
        document.getElementById("header").classList.remove("fixed");
    }
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Update cart indicator if it exists
    const cartIndicator = document.getElementById("cart-indicator");
    if (cartIndicator) {
        cartIndicator.innerHTML = totalItems;
    }
}
