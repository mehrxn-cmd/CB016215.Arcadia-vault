// ====== SETUP ======
let products = []; // Stores all products
let cart = JSON.parse(localStorage.getItem('cart')) || {}; // Loads saved cart or creates empty one

// Get important HTML elements
const elements = {
    productContainer: document.getElementById('product-sections'),
    cartIcon: document.getElementById('cart-icon'),
    cartPanel: document.getElementById('cart-panel'),
    cartTableBody: document.querySelector('#cart-table tbody'),
    cartTotal: document.getElementById('cart-total'),
    cartCount: document.getElementById('cart-count')
};

// ====== INITIAL LOAD ======
window.addEventListener('DOMContentLoaded', init);

function init() {
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            products = data;
            showProducts();
            updateCart();
            setupEvents();
        });
}

// ====== SHOW PRODCTS ======
function showProducts() {
    // Cleasr existing products
    elements.productContainer.innerHTML = '';

    const categories = [...new Set(products.map(p => p.category))];

    categories.forEach(category => {
        // Create category section
        elements.productContainer.innerHTML += `
            <section>
                <h2>${category}</h2>
                <div class="products-grid">
                    ${products
                .filter(p => p.category === category)
                .map(product => `
                            <div class="product-card">
                                <img src="${product.image}" alt="${product.name}">
                                <h3>${product.name}</h3>
                                <p>$${product.price}</p>
                                <button onclick="addToCart('${product.id}')">Add to Cart</button>
                            </div>
                        `).join('')}
                </div>
            </section>
        `;
    });
}

// ====== CART FUNCTIONS ======
function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1; // Add 1 to quantity
    saveCart();
    updateCart();
}

function updateCart() {
    let total = 0;
    let html = '';

    // Build cart items HTML
    for (const id in cart) {
        const product = products.find(p => p.id === id);
        if (product && cart[id] > 0) {
            const itemTotal = product.price * cart[id];
            total += itemTotal;

            html += `
                <tr>
                    <td>${product.name}</td>
                    <td>$${product.price}</td>
                    <td>
                        <button onclick="changeQty('${id}', -1)">-</button>
                        ${cart[id]}
                        <button onclick="changeQty('${id}', 1)">+</button>
                    </td>
                    <td>$${itemTotal}</td>
                </tr>
            `;
        }
    }

    // Update cart table
    elements.cartTableBody.innerHTML = html;
    elements.cartTotal.textContent = `$${total}`;
    elements.cartCount.textContent = Object.values(cart).reduce((a, b) => a + b, 0);
}

function changeQty(id, change) {
    cart[id] += change;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    updateCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ====== EVENT HANDLERS ======
function setupEvents() {
    // Cart toggle
    elements.cartIcon.addEventListener('click', () => {
        elements.cartPanel.classList.add('active');
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        elements.cartPanel.classList.remove('active');
    });
}

// ====== HECKOUT & FAVORITES ======
function buyNow() {
    localStorage.setItem('order', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

function addToFavorites() {
    localStorage.setItem('favorites', JSON.stringify(cart));
    alert('Saved as favorites!');
}

function applyFavorites() {
    cart = JSON.parse(localStorage.getItem('favorites')) || {};
    saveCart();
    updateCart();
}

// Load order from localStorage
const order = JSON.parse(localStorage.getItem('order')) || {};

// Fetch products
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        displayOrderSummary(products, order);
    });

function displayOrderSummary(products, order) {
    const tbody = document.querySelector('#summary-table tbody');
    tbody.innerHTML = '';
    let subtotal = 0;

    for (const productId in order) {
        const product = products.find(p => p.id === productId);
        if (product && order[productId] > 0) {
            const row = document.createElement('tr');
            const itemTotal = product.price * order[productId];
            subtotal += itemTotal;

            row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${order[productId]}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>$${itemTotal.toFixed(2)}</td>
                `;
            tbody.appendChild(row);
        }
    }

    const shipping = 10.00;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

document.getElementById('checkout-form').onsubmit = function (e) {
    e.preventDefault();
    document.getElementById('thank-you-msg').textContent =
        "Thank you for your purchase! Your order will arrive in 3-5 business days.";
    document.getElementById('thank-you-msg').style.display = 'block';

    // Clear cart after purchase
    localStorage.removeItem('cart');
    localStorage.removeItem('order');

    // Optional: Scroll to thank you message
    document.getElementById('thank-you-msg').scrollIntoView({
        behavior: 'smooth'
    });
};