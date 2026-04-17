// La variable `products` ahora viene del archivo global `products.js`

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
    
    // Update main image if exists
    const mainImage = document.getElementById('main-image');
    if (product.image) {
        mainImage.innerHTML = `<img src="${product.image}" id="current-main-img" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;">`;
    } else {
        mainImage.innerHTML = `<span id="main-image-text">Vista Frontal</span>`;
    }
    
    // Update thumbnail strip
    const thumbnailStrip = document.querySelector('.thumbnail-strip');
    thumbnailStrip.innerHTML = ''; // Clear existing thumbnails
    
    if (product.gallery && Object.keys(product.gallery).length > 0) {
        let isFirst = true;
        for (const [label, imgUrl] of Object.entries(product.gallery)) {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${isFirst ? 'active' : ''}`;
            thumb.onclick = function() { changeImage(imgUrl, label, this); };
            
            // Add a small preview image inside the thumbnail
            thumb.innerHTML = `<img src="${imgUrl}" alt="${label}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            // thumb.textContent = label; // We could add text, but image looks better
            
            thumbnailStrip.appendChild(thumb);
            isFirst = false;
        }
    } else {
        // Fallback to text thumbnails if no gallery
        thumbnailStrip.innerHTML = `
            <div class="thumbnail active" onclick="changeImageText('Vista Frontal', this)">Frontal</div>
            <div class="thumbnail" onclick="changeImageText('Vista Trasera', this)">Trasera</div>
        `;
    }
    
    // Reset size selection when rendering
    selectedSize = null;
    document.getElementById('add-to-cart-main').disabled = true;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
}

// Global function to change main image (when using real images)
window.changeImage = function(imgUrl, label, element) {
    const mainImg = document.getElementById('current-main-img');
    if (mainImg) {
        mainImg.src = imgUrl;
    }
    
    // Update active state on thumbnails
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
};

// Global function to change main image (when using placeholder text)
window.changeImageText = function(text, element) {
    const textSpan = document.getElementById('main-image-text');
    if (textSpan) {
        textSpan.textContent = text;
    }
    
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
