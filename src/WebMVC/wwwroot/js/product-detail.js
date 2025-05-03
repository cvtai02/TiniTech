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
        quantity,
        selectedAttributes,
        name: productName,
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
            priceElement.textContent = "$" + selectedVariant.price;
        if (skuElement) skuElement.textContent = selectedVariant.sku;
        if (stockElement) {
            stockElement.textContent = selectedVariant.stock + " left";
            stockElement.className =
                "font-medium " +
                (selectedVariant.stock > 0 ? "text-green-700" : "text-red-700");
        }
        if (soldElement) {
            soldElement.textContent = selectedVariant.sold + " sold";
        }
    } else {
        if (priceElement) priceElement.textContent = "$" + productData.price;
        if (skuElement)
            skuElement.textContent = "This combination has no variant";
        if (stockElement) {
            stockElement.textContent = productData.stock + " left";
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
        if (parseInt(quantityInput.value) > maxStock) {
            quantityInput.value = maxStock;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeAttributes();

    const addressForm = document.getElementById("addressForm");
    if (addressForm) {
        addressForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = {
                receiverName: document.getElementById("receiverName").value,
                phoneNumber: document.getElementById("phoneNumber").value,
                city: document.getElementById("city").value,
                district: document.getElementById("district").value,
                ward: document.getElementById("ward").value,
                detailAddress: document.getElementById("detailAddress").value,
            };

            addToCart();

            console.log("Proceeding to checkout with address:", formData);

            const queryParams = new URLSearchParams({
                receiverName: formData.receiverName,
                phoneNumber: formData.phoneNumber,
            }).toString();

            window.location.href = "/checkout?" + queryParams;
        });
    }
});
