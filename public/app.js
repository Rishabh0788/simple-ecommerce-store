// Local Storage Helper Functions for Shopping Cart
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.innerText = count;
}

// 1. Fetch & Display Product Listing
async function loadProducts() {
    updateCartCount();
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const container = document.getElementById('product-list');
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div>
                    <a href="product.html?id=${product.id}" class="btn">View Details</a>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})" class="btn btn-success">Add to Cart</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// 2. Fetch & Display Single Product Details
async function loadProductDetails() {
    updateCartCount();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) return;

    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        const container = document.getElementById('product-detail');
        container.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h2>${product.name}</h2>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p style="margin: 1rem 0;">${product.description}</p>
                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})" class="btn btn-success">Add to Cart</button>
            </div>
        `;
    } catch (error) {
        console.error("Error loading product details:", error);
    }
}

// 3. Add Item to Shopping Cart
function addToCart(id, name, price) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveCart(cart);
    alert(`${name} added to cart!`);
}

// 4. Display Shopping Cart
function displayCart() {
    updateCartCount();
    const cart = getCart();
    const container = document.getElementById('cart-container');

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty. <a href='index.html'>Continue shopping</a>.</p>";
        return;
    }

    let total = 0;
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button onclick="removeFromCart(${item.id})" class="btn btn-danger">Remove</button></td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <h3>Total Amount: $${total.toFixed(2)}</h3>
        <br>
        <a href="checkout.html" class="btn btn-success">Proceed to Checkout</a>
    `;

    container.innerHTML = html;
}

// 5. Remove Item from Cart
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    displayCart();
}

// 6. Setup Checkout Page Total
function setupCheckout() {
    updateCartCount();
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkout-total').innerText = total.toFixed(2);
}

// 7. Order Processing API Call
async function processOrder(event) {
    event.preventDefault();
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const customerInfo = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerInfo, cartItems: cart, totalAmount })
        });

        const result = await response.json();

        if (result.success) {
            alert(`Thank you! ${result.message}\nOrder ID: ${result.orderId}`);
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        } else {
            alert("Failed to process order.");
        }
    } catch (error) {
        console.error("Error processing order:", error);
    }
}