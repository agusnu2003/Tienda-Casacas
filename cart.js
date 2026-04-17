document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartBadge = document.getElementById('cart-badge');

    // Load cart from localStorage or start empty
    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('aura_cart', JSON.stringify(cart));
    }

    // Toggle Cart Functions
    window.openCart = function () {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    };

    window.closeCart = function () {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Add to Cart Logic (Global so it can be called from anywhere)
    window.addToCart = function (name, price, size = null) {
        const cartItemId = size ? `${name}-${size}` : name;

        // Check if item exists in cart
        const existingItem = cart.find(item => item.id === cartItemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: cartItemId, name, price, size, quantity: 1 });
        }

        saveCart();
        updateCart();
        openCart(); // Show cart automatically when item is added
    };

    // Attach to buttons on index page
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Prevent default just in case it's inside an anchor (we restructured HTML but good to have)
            e.preventDefault();
            e.stopPropagation();
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));

            // For index page, we might just add a default size or require going to product page.
            // Let's add it without size for now, or assume 'M' if we wanted.
            addToCart(name, price, null);
        });
    });

    // Remove item from Cart
    window.removeFromCart = function (id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCart();
    };

    // Update Quantity
    window.updateQuantity = function (id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                saveCart();
                updateCart();
            }
        }
    };

    // Render Cart Function
    function updateCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                totalItems += item.quantity;

                const sizeText = item.size ? ` - Talle ${item.size}` : '';
                const displayName = `${item.name}${sizeText}`;

                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';

                // Use data attributes and addEventListener to prevent quote breaking issues
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${displayName}</h4>
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus">+</button>
                        <button class="remove-btn" title="Eliminar">&times;</button>
                    </div>
                `;

                // Safely attach event listeners
                const minusBtn = itemEl.querySelector('.minus');
                const plusBtn = itemEl.querySelector('.plus');
                const removeBtn = itemEl.querySelector('.remove-btn');

                minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
                plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
                removeBtn.addEventListener('click', () => removeFromCart(item.id));

                cartItemsContainer.appendChild(itemEl);
            });
        }

        if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            // Add pop animation to badge
            cartBadge.classList.add('pop');
            setTimeout(() => cartBadge.classList.remove('pop'), 300);
        }
    }

    // WhatsApp Checkout Integration
    const checkoutBtns = document.querySelectorAll('.checkout-btn');
    checkoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            // Cambia este número por tu número de WhatsApp real, incluyendo código de país (ej. 549 para Argentina)
            const phoneNumber = "549115510298";

            let message = "¡Hola! Quiero realizar la siguiente compra en AURA:\n\n";
            let total = 0;

            cart.forEach(item => {
                const sizeText = item.size ? ` (Talle ${item.size})` : '';
                const itemTotal = item.price * item.quantity;
                message += `- ${item.quantity}x ${item.name}${sizeText} - $${itemTotal.toFixed(2)}\n`;
                total += itemTotal;
            });

            message += `\n*Total a pagar: $${total.toFixed(2)}*`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        });
    });

    // Initial Render
    updateCart();
});
