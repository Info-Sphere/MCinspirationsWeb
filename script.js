function addToCart(event) {
    const productName = event.target.dataset.name;
    const productPrice = parseFloat(event.target.dataset.price);
    const productCategory = event.target.dataset.category;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => item.name === productName && item.category === productCategory);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1, category: productCategory });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // Update the cart count immediately
    if (window.location.pathname.includes("checkout.html") || window.location.pathname.includes("cart.html")) {
        displayCartItems(); // Update cart display on checkout/cart page
    }
}

function loadProducts(category, isFeatured) {
    const productContainer = document.getElementById("product-list");
    if (!productContainer) {
        console.error("Product container not found!");
        return;
    }

    const categoryProducts = products[category];
    productContainer.innerHTML = '';

    if (!categoryProducts) {
        console.error("Invalid category:", category);
        productContainer.innerHTML = "<p>No products found for this category.</p>";
        return;
    }

    let productsToDisplay = categoryProducts;

    if (isFeatured) {
        productsToDisplay = categoryProducts.filter(product => product.featured === "yes");
        if (productsToDisplay.length === 0) {
            productContainer.innerHTML = "<p>No featured products found for this category.</p>";
            return;
        }
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");

        const img = document.createElement('img');
        img.src = product.imageUrl;
        img.alt = product.name;
        productCard.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = product.name;
        productCard.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = product.description;
        productCard.appendChild(p);

        const span = document.createElement('span');
        span.textContent = '$' + product.price.toFixed(2);
        productCard.appendChild(span);

        const button = document.createElement('button');
        button.classList.add('add-to-cart');
        button.dataset.name = product.name;
        button.dataset.price = product.price;
        button.dataset.category = category;
        button.textContent = 'Add to Cart';
        productCard.appendChild(button);

        productContainer.appendChild(productCard);
    });

    // ***KEY CHANGE: Removed event listener attachment from here***
}

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartCount = document.getElementById("cart-count");

        if (cartCount) {
            let totalQuantity = 0;
            cart.forEach(item => {
                totalQuantity += item.quantity;
            });
            cartCount.textContent = totalQuantity;
        } else {
            console.error("Cart count element not found!");
        }

    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof products === 'undefined') {
        const script = document.createElement('script');
        script.src = 'products.js';
        script.onload = () => {
            updateCartCount();
            if (window.location.pathname.includes("index.html")) {
                loadProducts("jewelry", true);
                loadProducts("accessories", true);
                loadProducts("gifts", true);
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get('category');
                if (category) {
                    loadProducts(category);
                } else {
                    console.error("No category specified.");
                    const productContainer = document.getElementById("product-list");
                    if (productContainer) {
                        productContainer.innerHTML = "<p>No products found.</p>";
                    }
                }
            }
        };
        document.head.appendChild(script);
    } else {
        updateCartCount();
        if (window.location.pathname.includes("index.html")) {
            loadProducts("jewelry", true);
            loadProducts("accessories", true);
            loadProducts("gifts", true);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            if (category) {
                loadProducts(category);
            } else {
                console.error("No category specified.");
                const productContainer = document.getElementById("product-list");
                if (productContainer) {
                    productContainer.innerHTML = "<p>No products found.</p>";
                }
            }
        }
    }

    // ***KEY CHANGE: Event listener attached ONCE here***
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            addToCart(event);
        }
    });
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateCartCount();
    }
});