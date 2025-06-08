// Product detail page functionality
let selectedAttributes = {};
let selectedVariant = null;

function selectMainImage(index) {
    // Update main image
    const mainImageEl = document.getElementById("mainImage");

    if (index >= 0 && index < productImages.length) {
        mainImageEl.src = productImages[index].imageUrl;
        mainImageEl.alt = productName;

        // Update thumbnails highlighting
        document.querySelectorAll('[id^="thumbnail-"]').forEach((thumb) => {
            const img = thumb.querySelector("img");
            if (img) {
                // Remove blue border from all thumbnails
                img.classList.remove("border-blue-600");
                // Add back appropriate border
                console.log(thumb.id, `thumbnail-${index}`);
                if (thumb.id === `thumbnail-${index}`) {
                    img.classList.add("border-blue-600");
                }
            }
        });

        // Scroll the thumbnail into view
        scrollToThumbnail(index);
    }
}

function scrollToThumbnail(index) {
    const container = document.getElementById("thumbnailContainer");
    const thumbnail = document.getElementById(`thumbnail-${index}`);

    if (container && thumbnail) {
        // Calculate positioning to center the clicked thumbnail
        const containerHeight = container.clientHeight;
        const thumbnailTop = thumbnail.offsetTop;
        const thumbnailHeight = thumbnail.clientHeight;

        // Calculate the scroll position that centers the thumbnail
        const scrollPosition =
            thumbnailTop - containerHeight / 2 + thumbnailHeight / 2;

        // Smooth scroll to the calculated position
        container.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
        });
    }
}

// Modal functions
function showAddressModal() {
    document.getElementById("addressModal").classList.remove("hidden");
    document.getElementById("addressModal").classList.add("flex");
    console.log("isAuthenticated", isAuthenticated());
    if (isAuthenticated()) {
        document
            .getElementById("addressModel-authNavigation")
            .classList.add("hidden");
    }
    document.body.style.overflow = "hidden";
}

function closeAddressModal() {
    document.getElementById("addressModal").classList.add("hidden");
    document.getElementById("addressModal").classList.remove("flex");
    document.body.style.overflow = "";
}

function isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}

function increaseQuantity() {
    const input = document.getElementById("quantityInput");
    const maxStock = selectedVariant ? selectedVariant.stock : productStock;
    const currentVal = parseInt(input.value) || 0;
    if (currentVal < maxStock) {
        input.value = currentVal + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById("quantityInput");
    const currentVal = parseInt(input.value) || 0;
    if (currentVal > 1) {
        input.value = currentVal - 1;
    } else {
        input.value = 1;
    }
}

function validateQuantity(el) {
    const maxStock = selectedVariant ? selectedVariant.stock : productStock;
    const currentVal = parseInt(el.value) || 0;

    if (currentVal <= 0 || isNaN(currentVal)) {
        el.value = 1;
    } else if (currentVal > maxStock) {
        el.value = maxStock;
    }
}

function addToCart() {
    const quantity =
        parseInt(document.getElementById("quantityInput").value) || 1;

    // Create cart item object
    const cartItem = {
        productId: productId,
        variantId: selectedVariant ? selectedVariant.id : null,
        name: productName,
        quantity,
        selectedAttributes,
        price: selectedVariant ? selectedVariant.price : productPrice,
        imageUrl: mainImageUrl,
        timestamp: new Date().getTime(),
    };

    // Get existing cart or initialize new one
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product+variant already exists in cart
    const existingItemIndex = cart.findIndex(
        (item) =>
            item.productId === productId &&
            item.variantId === cartItem.variantId
    );

    if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item if it doesn't exist
        cart.push(cartItem);
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count indicator
    updateCartCount();

    // Show confirmation message
    toast("Product added to your cart!");
}

function buyNow() {
    console.log("Buy Now clicked!");
    // Show the address modal instead of immediately redirecting
    showAddressModal();
}

// Initialize default attribute selection
function initializeAttributes() {
    // First pass - set initial values
    productData.attributes.forEach((attr) => {
        if (attr.values.length > 0) {
            selectedAttributes[attr.attributeId] = attr.values[0].value;
        }
    });

    // Second pass - update UI after all initial values are set
    updateValidCombinations();
    productData.attributes.forEach((attr) => {
        if (attr.values.length > 0) {
            highlightSelected(attr.attributeId, attr.values[0].value);
        }
    });
    updateSelectedVariant();
}

function getValidValuesByAttributeId(attributeId) {
    // Get all other selected attributes
    const otherSelections = { ...selectedAttributes };
    delete otherSelections[attributeId];

    // Find all variants that match the other selections
    const validValues = new Set();

    productData.variants.forEach((variant) => {
        // Check if this variant matches all other selected attributes
        const matchesOtherSelections = Object.entries(otherSelections).every(
            ([attrId, value]) => {
                const varAttr = variant.variantAttributes.find(
                    (va) => va.attributeId == attrId
                );
                return varAttr && varAttr.value === value;
            }
        );

        if (matchesOtherSelections) {
            // Add this variant's value for the current attribute to valid values
            const thisAttrValue = variant.variantAttributes.find(
                (va) => va.attributeId == attributeId
            );
            if (thisAttrValue) {
                validValues.add(thisAttrValue.value);
            }
        }
    });

    return validValues;
}

function updateValidCombinations() {
    // For each attribute, determine valid values based on other selections
    productData.attributes.forEach((attr) => {
        const attributeId = attr.attributeId;
        const validValues = getValidValuesByAttributeId(attributeId);

        // Update UI for each value of this attribute
        document
            .querySelectorAll(`[data-attribute-id="${attributeId}"]`)
            .forEach((el) => {
                const value = el.getAttribute("data-value");

                if (validValues.size === 0 || validValues.has(value)) {
                    // This is a valid option
                    el.disabled = false;
                    el.classList.remove(
                        "opacity-50",
                        "invalid-value-button",
                        "cursor-not-allowed"
                    );
                } else {
                    // This would lead to no variants - disable it
                    el.disabled = true;
                    el.classList.add(
                        "opacity-50",
                        "invalid-value-button",
                        "cursor-not-allowed"
                    );

                    // If this was selected, select a valid option instead
                    if (selectedAttributes[attributeId] === value) {
                        // Find first valid value and select it
                        if (validValues.size > 0) {
                            const firstValid = validValues
                                .values()
                                .next().value;
                            selectedAttributes[attributeId] = firstValid;
                            highlightSelected(attributeId, firstValid);
                        }
                    }
                }
            });
    });
}

function selectAttribute(attributeId, value, element) {
    // If this option is disabled, don't select it
    if (element && element.disabled) {
        return;
    }

    selectedAttributes[attributeId] = value;
    highlightSelected(attributeId, value);

    // Check if this is a primary attribute (like color)
    const isPrimary = isPrimaryAttribute(attributeId);

    if (isPrimary) {
        // Try to find an image that matches this attribute value
        updateMainImageForAttributeValue(attributeId, value);
    }

    // After selecting an attribute, need to update which combinations are valid
    updateValidCombinations();
    updateSelectedVariant();
}

// Determine if an attribute is considered "primary" (colors, etc)
function isPrimaryAttribute(attributeId) {
    // If we have attributes defined
    if (productData.attributes && productData.attributes.length > 0) {
        // Check if it's the first attribute (often the primary visual attribute)
        if (productData.attributes[0].attributeId === attributeId) {
            return true;
        }

        // Or check if it has a name typically used for primary visual attributes
        const attribute = productData.attributes.find(
            (a) => a.attributeId === attributeId
        );
        if (attribute) {
            const name = attribute.name.toLowerCase();
            // Common names for primary visual attributes
            const primaryNames = ["color", "colour", "farbe", "cor"];
            return primaryNames.some((pName) => name.includes(pName));
        }
    }
    return false;
}

// Update the main product image based on the selected attribute value
function updateMainImageForAttributeValue(attributeId, value) {
    // Find the attribute value that matches
    let attributeValue = null;

    // Look through attributes to find the matching value with an image
    for (const attr of productData.attributes) {
        if (attr.attributeId === attributeId) {
            // Find the specific value that was selected
            attributeValue = attr.values.find((v) => v.value === value);
            break;
        }
    }

    // If we found a matching attribute value with an image
    if (attributeValue && attributeValue.imageUrl) {
        // First try to find this image in the product images array
        const imageIndex = productImages.findIndex(
            (img) => img.imageUrl === attributeValue.imageUrl
        );

        if (imageIndex >= 0) {
            // If found in the product images, use selectMainImage to update everything
            selectMainImage(imageIndex);
        } else {
            // If not found in product images, update the main image directly
            const mainImageEl = document.getElementById("mainImage");
            if (mainImageEl) {
                mainImageEl.src = attributeValue.imageUrl;
                mainImageEl.alt = productName + " - " + value;

                // Update thumbnails highlighting to show none selected
                document
                    .querySelectorAll('[id^="thumbnail-"] img')
                    .forEach((thumb) => {
                        thumb.classList.remove("border-blue-600");
                    });
            }
        }
    }
}

function highlightSelected(attributeId, value) {
    document
        .querySelectorAll(`[data-attribute-id="${attributeId}"]`)
        .forEach((el) => {
            if (el.getAttribute("data-value") === value) {
                el.classList.add(
                    "border-black",
                    "border-2",
                    "text-primary",
                    "shadow-sm"
                );
                el.classList.remove(
                    "border-gray-200",
                    "hover:border-gray-400",
                    "hover:bg-gray-50"
                );
            } else {
                el.classList.remove(
                    "border-black",
                    "border-2",
                    "text-primary",
                    "shadow-sm"
                );
                el.classList.add(
                    "border-gray-200",
                    "hover:border-gray-400",
                    "hover:bg-gray-50"
                );
            }
        });
}

function updateSelectedVariant() {
    const attributeIds = Object.keys(selectedAttributes);
    selectedVariant = null;

    if (attributeIds.length === productData.attributes.length) {
        productData.variants.forEach((variant) => {
            if (variant.variantAttributes.length === attributeIds.length) {
                const isMatch = variant.variantAttributes.every((attr) => {
                    return (
                        selectedAttributes[attr.attributeId] === attr.value &&
                        productData.attributes.some(
                            (a) => a.attributeId === attr.attributeId
                        )
                    );
                });

                if (isMatch) {
                    selectedVariant = variant;
                }
            }
        });
    }

    // Update the UI
    const priceElement = document.getElementById("selectedPrice");
    const skuElement = document.getElementById("selectedSku");
    const soldElement = document.getElementById("soldDisplay");
    const stockElement = document.getElementById("stockDisplay");

    if (selectedVariant) {
        if (priceElement)
            priceElement.textContent = formatVND(selectedVariant.price);
        if (skuElement) skuElement.textContent = selectedVariant.sku;
        if (stockElement) {
            stockElement.textContent = "còn " + selectedVariant.stock;
            stockElement.className =
                "font-medium " +
                (selectedVariant.stock > 0 ? "text-green-700" : "text-red-700");
        }
        if (soldElement) {
            soldElement.textContent = "đã bán " + selectedVariant.sold;
        }
    } else {
        if (priceElement)
            priceElement.textContent = formatVND(productData.price);
        if (skuElement)
            skuElement.textContent = "This combination has no variant";
        if (stockElement) {
            stockElement.textContent = "còn " + productData.stock;
            stockElement.className =
                "font-medium " +
                (productData.stock > 0 ? "text-green-700" : "text-red-700");
        }
    }

    // Update quantity constraints
    const quantityInput = document.getElementById("quantityInput");
    if (quantityInput) {
        const maxStock = selectedVariant
            ? selectedVariant.stock
            : productData.stock;
        if (maxStock === 0) {
            quantityInput.value = 0;
        } else {
            quantityInput.value = 1;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeAttributes();

    const addressForm = document.getElementById("addressForm");
    if (addressForm) {
        addressForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            try {
                const quantity =
                    parseInt(document.getElementById("quantityInput").value) ||
                    0;

                // Create the order item
                const orderItem = {
                    productId: parseInt(productId),
                    variantId: selectedVariant ? selectedVariant.id : null,
                    quantity: quantity,
                    unitPrice: selectedVariant
                        ? selectedVariant.price
                        : productPrice,
                };

                // Create the address object matching our backend model
                const address = {
                    owner: document.getElementById("receiverName").value,
                    phoneNumber: document.getElementById("phoneNumber").value,
                    email: document.getElementById("email").value,
                    province: document.getElementById("city").value,
                    district: document.getElementById("district").value,
                    ward: document.getElementById("ward").value,
                    detailAddress:
                        document.getElementById("detailAddress").value,
                };

                // Calculate the total price
                const totalPrice = orderItem.unitPrice * quantity;

                // Create the complete order object
                const orderData = {
                    billingAddress: address,
                    items: [orderItem],
                    totalPrice: totalPrice,
                };

                // Show loading state
                const submitButton = addressForm.querySelector(
                    'button[type="submit"]'
                );
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = "Processing...";

                // Send the order to the API
                const response = await apiFetch("/api/checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                if (response.ok) {
                    const result = await response.json();

                    // Close the modal
                    closeAddressModal();

                    // Show success message
                    toast("Order placed successfully!");

                    // Redirect to order confirmation or order detail page
                    // setTimeout(() => {
                    //     window.location.href = `/orders/${result.orderId}`;
                    // }, 1500);
                } else {
                    const error = await response.json();
                    throw new Error(error.title || "Failed to place order");
                }
            } catch (error) {
                console.error("Error placing order:", error);
                toast(
                    error.message || "Failed to place order. Please try again."
                );
            } finally {
                // Reset button state
                const submitButton = addressForm.querySelector(
                    'button[type="submit"]'
                );
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // Set up star rating functionality
    const stars = document.querySelectorAll(".rating-star");
    const ratingInput = document.getElementById("rating");

    // Handle star rating selection
    stars.forEach((star) => {
        star.addEventListener("click", function () {
            const value = parseInt(this.getAttribute("data-value"));
            ratingInput.value = value;

            // Update star visuals
            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.remove("text-gray-300");
                    s.classList.add("text-yellow-400");
                } else {
                    s.classList.remove("text-yellow-400");
                    s.classList.add("text-gray-300");
                }
            });
        });

        // Add hover effects
        star.addEventListener("mouseover", function () {
            const value = parseInt(this.getAttribute("data-value"));

            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.remove("text-gray-300");
                    s.classList.add("text-yellow-400");
                }
            });
        });

        star.addEventListener("mouseout", function () {
            const selectedRating = parseInt(ratingInput.value) || 0;

            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.remove("text-gray-300");
                    s.classList.add("text-yellow-400");
                } else {
                    s.classList.remove("text-yellow-400");
                    s.classList.add("text-gray-300");
                }
            });
        });
    });

    // Handle form submission
    const reviewForm = document.getElementById("reviewForm");

    reviewForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get form values
        const productId = parseInt(
            document.getElementById("submitProductId").value
        );
        const rating = parseInt(document.getElementById("rating").value);
        const comment = document.getElementById("comment").value;

        // Validate form inputs
        if (!rating) {
            toast("Please select a rating");
            return;
        }

        if (!comment.trim()) {
            toast("Please write a review comment");
            return;
        }

        // Get user information from localStorage
        const user = getUserFromLocalStorage();

        // Prepare data object for API submission
        const submitData = {
            productId: productId,
            userName: user ? user.name : "Anonymous",
            avatar: user ? user.imageUrl : "",
            rating: rating,
            comment: comment,
        };

        console.log("Submitting review:", submitData);

        const submitButton = reviewForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = "Submitting...";

            // Send data to API
            const response = await apiFetch("/api/ratings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            const result = await response.json();

            // Reset form
            reviewForm.reset();
            ratingInput.value = "";

            // Reset star visuals
            stars.forEach((s) => {
                s.classList.remove("text-yellow-400");
                s.classList.add("text-gray-300");
            });

            // Show success message
            toast("Your review has been submitted successfully!");

            // Optional: Refresh reviews section or add the new review to the list
            // This depends on your application structure

            // If you have a function to reload reviews, call it here
            // loadReviews(productId);
        } catch (error) {
            console.error("Error submitting review:", error);
            toast(error.message);
        } finally {
            // Reset button state
            const submitButton = reviewForm.querySelector(
                'button[type="submit"]'
            );
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});

function renderCustomerReviews(model) {
    console.log("Rendering customer reviews:", model);
    // Start the container for the entire reviews section
    let html = `
      <div>
        <h3 class="text-xl font-semibold mb-4">Bình luận của khách hàng</h3>
    `;

    // Check if there are any ratings
    if (model.ratings.items && model.ratings.items.length > 0) {
        // Container for all reviews
        html += '<div class="space-y-6">';

        // Loop through each rating
        model.ratings.items.forEach((rating) => {
            html += `
          <div class="border-b border-gray-200 pb-4">
            <div class="flex items-center mb-2">
        `;

            // Avatar handling
            if (rating.avatar && rating.avatar.trim() !== "") {
                html += `<img src="${rating.avatar}" alt="${rating.userName}" class="w-10 h-10 rounded-full mr-3" />`;
            } else {
                const initial =
                    rating.userName && rating.userName.length > 0
                        ? rating.userName[0].toUpperCase()
                        : "U";
                html += `
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              <span class="text-gray-600 font-semibold">${initial}</span>
            </div>
          `;
            }

            // User info and stars
            html += `
            <div>
              <p class="font-semibold">${rating.userName}</p>
              <div class="flex">
        `;

            // Stars
            for (let i = 1; i <= 5; i++) {
                if (i <= rating.rating) {
                    // Filled star
                    html += `
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            `;
                } else {
                    // Empty star
                    html += `
              <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            `;
                }
            }

            // Date
            const formattedDate = rating.createdAt
                ? formatDate(rating.createdAt)
                : "";
            html += `
                <span class="text-xs text-gray-500 ml-2">${formattedDate}</span>
              </div>
            </div>
          </div>
          <p class="text-gray-700">${rating.comment}</p>
        </div>
        `;
        });

        html += "</div>"; // Close the reviews container

        // Pagination
        if (model.ratings.totalPages > 0) {
            html += `
          <div class="flex justify-center mt-6">
            <nav class="relative z-0 inline-flex shadow-sm">
        `;

            const productId = model.summary.productId;
            const currentPage = model.ratings.pageNumber;
            const totalPages = model.ratings.totalPages;

            // Previous button
            if (model.ratings.hasPreviousPage) {
                html += `
            <div onclick="handleRatingPageClick(${
                currentPage - 1
            })" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          `;
            }

            // Page numbers
            for (
                let i = Math.max(1, currentPage - 2);
                i <= Math.min(totalPages, currentPage + 2);
                i++
            ) {
                const isCurrentPage = i === currentPage;
                const pageClass = isCurrentPage
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:bg-gray-50";

                html += `
            <div onclick="handleRatingPageClick(${i})" 
                 class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${pageClass} cursor-pointer">
              ${i}
            </div>
          `;
            }

            // Next button
            if (model.ratings.hasNextPage) {
                html += `
            <div onclick="handleRatingPageClick(${
                currentPage + 1
            })" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          `;
            }

            html += `
            </nav>
          </div>
        `;
        }
    } else {
        // No reviews
        html += `
        <div class="text-center py-8">
          <p class="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      `;
    }

    html += "</div>"; // Close the entire section
    return html;
}

// Helper function to format the date
function formatDate(dateString) {
    if (!dateString) return "";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        const options = { month: "short", day: "2-digit", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    } catch (e) {
        return "";
    }
}

async function handleRatingPageClick(page) {
    console.log("Page clicked:", page);
    const response = await apiFetch(
        `/api/ratings?productId=${productId}&page=${page}`,
        {
            method: "GET",
        }
    );

    if (response.ok) {
        const data = await response.json();
        console.log("Ratings data:", data);
        document.getElementById("reviews-container").innerHTML =
            renderCustomerReviews(data);
    } else {
        console.error("Failed to fetch ratings:", response.statusText);
        toast("Failed to load ratings. Please try again later.");
    }
}
