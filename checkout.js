function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total-price");

    if (!cartItemsContainer || !cartTotal) {
        console.error("Cart items container or cart total element not found!");
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length > 0) {
        cart.forEach((item, index) => {
            const product = window.products[item.category].find(p => p.name === item.name);

            if (product) {
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");

                const price = parseFloat(product.price);

                itemElement.innerHTML = `
                    <p>${item.name} x ${item.quantity}</p>
                    <p>$${(price * item.quantity).toFixed(2)}</p>
                    <button class="remove-from-cart" data-index="${index}">Remove</button>
                `;

                cartItemsContainer.appendChild(itemElement);
                total += price * item.quantity;
            } else {
                console.error(`Product ${item.name} not found in products data.`);
            }
        });
    } else {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }

    cartTotal.textContent = total.toFixed(2);

    const removeButtons = document.querySelectorAll(".remove-from-cart");
    removeButtons.forEach(button => {
        button.addEventListener("click", removeFromCart);
    });
}

function removeFromCart(event) {
    const indexToRemove = parseInt(event.target.dataset.index);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[indexToRemove].quantity > 1) {
        cart[indexToRemove].quantity--;
    } else {
        cart.splice(indexToRemove, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function proceedToCheckout() {
    // Your checkout logic here
    alert("Proceeding to checkout (This is a placeholder)");
}

document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    updateCartCount();

    const checkoutButton = document.getElementById("checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", proceedToCheckout);
    }
});