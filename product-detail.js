// Mock Database for products
const products = {
    '1': {
        name: "Camiseta 'Void' Oversize",
        price: 45.00,
        description: "Un diseño minimalista y amplio. Confeccionada en algodón orgánico pesado para una caída perfecta. Ideal para un look urbano y moderno."
    },
    '2': {
        name: "Camiseta 'Neon Pulse'",
        price: 50.00,
        description: "Inspirada en las luces de la ciudad de noche. Detalles vibrantes en verde neón sobre un fondo negro profundo."
    },
    '3': {
        name: "Camiseta 'Minimal Core'",
        price: 35.00,
        description: "El esencial de cada día. Corte regular, costuras reforzadas y un tejido transpirable que te mantiene cómodo 24/7."
    },
    '4': {
        name: "Camiseta 'Eclipse'",
        price: 40.00,
        description: "El equilibrio entre la luz y la sombra. Diseño de doble tono sutil que destaca sin ser demasiado ruidoso."
    }
};

let currentProduct = null;
let selectedSize = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL to get product ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId && products[productId]) {
        currentProduct = products[productId];
        renderProductDetails(currentProduct);
    } else {
        // Fallback if no ID or invalid ID
        document.getElementById('detail-title').textContent = "Producto no encontrado";
        document.querySelector('.description').textContent = "Por favor, vuelve a la tienda para seleccionar un producto válido.";
        document.getElementById('detail-price').textContent = "";
        document.querySelector('.size-selector').style.display = 'none';
        document.getElementById('add-to-cart-main').style.display = 'none';
    }

    // 2. Add to Cart Button Logic
    const addToCartBtn = document.getElementById('add-to-cart-main');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (currentProduct && selectedSize) {
                // Call the global addToCart function defined in cart.js
                window.addToCart(currentProduct.name, currentProduct.price, selectedSize);
            }
        });
    }
});

// Render the product information
function renderProductDetails(product) {
    document.getElementById('detail-title').textContent = product.name;
    document.getElementById('detail-price').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.description').textContent = product.description;
    
    // Reset size selection when rendering
    selectedSize = null;
    document.getElementById('add-to-cart-main').disabled = true;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
}

// Global function to change main image
window.changeImage = function(text, element) {
    // Change text in the placeholder
    document.getElementById('main-image-text').textContent = text;
    
    // Update active state on thumbnails
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
};

// Global function to select size
window.selectSize = function(element, size) {
    selectedSize = size;
    
    // Update UI
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    element.classList.add('selected');
    
    // Enable add to cart button
    document.getElementById('add-to-cart-main').disabled = false;
};
