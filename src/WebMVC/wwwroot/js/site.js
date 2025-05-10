// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    setupAccountDropdown();

    const hrefs = window.location.href.split("/");

    //remove domain from hrefs
    const hrefsWithoutDomain = hrefs.slice(3);
    if (hrefsWithoutDomain.length <= 1) {
    } else {
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

function isAuthenticated() {
    const tokenExpries = localStorage.getItem("exp");
    const user = getUserFromLocalStorage();
    const isTokenExpired = tokenExpries
        ? new Date(tokenExpries) < new Date()
        : true;
    return !isTokenExpired && user !== null;
}

function getUserFromLocalStorage() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function setupAccountDropdown() {
    const accountIcon = document.getElementById("account-icon");
    const authDropdown = document.getElementById("auth-dropdown");
    const userDropdown = document.getElementById("user-dropdown");

    if (!accountIcon) return;

    // Update account icon appearance based on auth status
    updateAccountIcon();

    // Toggle dropdown on click
    accountIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        if (isAuthenticated()) {
            userDropdown.classList.toggle("hidden");
            if (authDropdown) authDropdown.classList.add("hidden");
        } else {
            authDropdown.classList.toggle("hidden");
            if (userDropdown) userDropdown.classList.add("hidden");
        }
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener("click", function () {
        if (authDropdown) authDropdown.classList.add("hidden");
        if (userDropdown) userDropdown.classList.add("hidden");
    });
}

function updateAccountIcon() {
    const accountIcon = document.getElementById("account-icon");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");

    if (!accountIcon) return;

    if (isAuthenticated()) {
        const user = getUserFromLocalStorage();

        // Update user info in dropdown
        if (userName) userName.textContent = user.name || "User";
        if (userEmail) userEmail.textContent = user.email || "";

        // If user has an image, replace the icon with the avatar
        if (user.imageUrl) {
            accountIcon.innerHTML = `<img src="${user.imageUrl}" alt="Avatar" class="rounded-full w-6 h-6">`;
        }
    }
}

async function logout() {
    // Clear authentication data

    await apiFetch("/api/account/logout", {
        method: "POST",
    })
        .then((response) => {
            if (response.status === 200) {
                // Logout successful

                // Redirect to home page
                localStorage.removeItem("user");
                localStorage.removeItem("exp");
                console.log("Logout successful");
                window.location.reload();
                // window.location.href = "/";
            } else {
                // Handle error response
                console.error("Logout failed:", response.statusText);
                alert("Logout failed. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error during logout:", error);
            toast("An error occurred during logout. Please try again.");
        });
}

async function apiFetch(input, init) {
    // --- Request Interceptor ---
    const modifiedInit = {
        ...init,
        credentials: "include",
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(input, modifiedInit);

        // --- Response Interceptor ---
        if (response.status >= 400) {
            if (response.status === 401) {
                throw new Error("Unauthorized! Please log in.");
            }

            // Thêm xử lý an toàn khi parse JSON
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                console.error("Error parsing JSON:", e);
                throw new Error(
                    "An error occurred while processing your request."
                );
            }
            throw new Error(`${errorBody.title}`);
        }
        return response;
    } catch (error) {
        console.error("Fetch error:", error);
        if (error.name === "TypeError") {
            throw new Error(`Lỗi kết nối`);
        } else {
            throw new Error(error);
        }
    }
}

function toast(message) {
    const toastContainer = document.getElementById("toastContainer");
    const toastElement = document.createElement("div");
    toastElement.className =
        "fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg transition-transform transform translate-y-full";
    toastElement.innerText = message;

    toastContainer.appendChild(toastElement);

    setTimeout(() => {
        toastElement.style.transform = "translateY(0)";
    }, 100);

    setTimeout(() => {
        toastElement.style.transform = "translateY(100%)";
        setTimeout(() => {
            toastContainer.removeChild(toastElement);
        }, 300);
    }, 3000);
}

function formatVND(value) {
    if (!value && value !== 0) return "";
    if (value === 0) return "0đ";
    return Number(value).toLocaleString("vi-VN") + " ₫";
}
