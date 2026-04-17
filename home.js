document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    
    // Select elements
    const selectTipo = document.getElementById('filter-tipo');
    const selectPais = document.getElementById('filter-pais');
    const selectEquipo = document.getElementById('filter-equipo');

    // Helper: Get unique values from products based on conditions
    function getUniqueValues(field, conditions = {}) {
        const values = new Set();
        for (const product of Object.values(products)) {
            let match = true;
            for (const [key, val] of Object.entries(conditions)) {
                if (val !== 'todos' && product[key] !== val) {
                    match = false;
                }
            }
            if (match) {
                values.add(product[field]);
            }
        }
        return Array.from(values).sort();
    }

    // Populate a select element with options
    function populateSelect(selectElement, values, defaultText) {
        selectElement.innerHTML = `<option value="todos">${defaultText}</option>`;
        values.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            
            // Format text (e.g. ARG -> Argentina, but since we use country codes or names, just capitalize)
            option.textContent = val;
            selectElement.appendChild(option);
        });
    }

    // Nivel 1: Change Type (Selección / Liga)
    if (selectTipo) {
        selectTipo.addEventListener('change', (e) => {
            const tipo = e.target.value;
            
            if (tipo === 'todos') {
                // Disable Nivel 2 and 3
                selectPais.disabled = true;
                selectPais.innerHTML = '<option value="todos">Selecciona tipo primero...</option>';
                
                selectEquipo.disabled = true;
                selectEquipo.innerHTML = '<option value="todos">Selecciona región/país primero...</option>';
            } else {
                // Enable Nivel 2 and populate based on Nivel 1
                selectPais.disabled = false;
                const availableCountries = getUniqueValues('pais', { tipo: tipo });
                populateSelect(selectPais, availableCountries, 'Todos los países');
                
                // Reset Nivel 3
                selectEquipo.disabled = true;
                selectEquipo.innerHTML = '<option value="todos">Selecciona país primero...</option>';
            }
            
            renderProducts();
        });
    }

    // Nivel 2: Change Pais
    if (selectPais) {
        selectPais.addEventListener('change', (e) => {
            const pais = e.target.value;
            const tipo = selectTipo.value;
            
            if (pais === 'todos') {
                // Disable Nivel 3
                selectEquipo.disabled = true;
                selectEquipo.innerHTML = '<option value="todos">Selecciona país primero...</option>';
            } else {
                // Enable Nivel 3 and populate based on Nivel 1 and Nivel 2
                selectEquipo.disabled = false;
                const availableTeams = getUniqueValues('equipo', { tipo: tipo, pais: pais });
                populateSelect(selectEquipo, availableTeams, 'Todos los equipos');
            }
            
            renderProducts();
        });
    }

    // Nivel 3: Change Equipo
    if (selectEquipo) {
        selectEquipo.addEventListener('change', () => {
            renderProducts();
        });
    }

    // Render products based on the 3 select states
    function renderProducts() {
        if (!productGrid) return;
        
        productGrid.innerHTML = '';
        let hasVisibleProducts = false;

        const currentTipo = selectTipo ? selectTipo.value : 'todos';
        const currentPais = selectPais && !selectPais.disabled ? selectPais.value : 'todos';
        const currentEquipo = selectEquipo && !selectEquipo.disabled ? selectEquipo.value : 'todos';

        for (const [id, product] of Object.entries(products)) {
            const matchTipo = currentTipo === 'todos' || product.tipo === currentTipo;
            const matchPais = currentPais === 'todos' || product.pais === currentPais;
            const matchEquipo = currentEquipo === 'todos' || product.equipo === currentEquipo;

            if (matchTipo && matchPais && matchEquipo) {
                hasVisibleProducts = true;
                
                const article = document.createElement('article');
                article.className = 'product-card';
                
                const imageHtml = product.image 
                    ? `<img src="${product.image}" alt="${product.name}" class="product-image">`
                    : `<div class="product-image-placeholder"><span>${product.name}</span></div>`;

                article.innerHTML = `
                    <a href="producto.html?id=${id}" class="product-link">
                        ${imageHtml}
                    </a>
                    <div class="product-info">
                        <a href="producto.html?id=${id}" class="product-link"><h3>${product.name}</h3></a>
                        <div class="price-row">
                            <span class="price">$${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                `;
                
                productGrid.appendChild(article);
            }
        }
        
        if (!hasVisibleProducts) {
            productGrid.innerHTML = `<p class="no-results" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">No se encontraron camisetas con estos filtros.</p>`;
        }
    }

    // Initial render
    renderProducts();

    // Mobile Menu Toggle for Colección
    const coleccionLink = document.getElementById('coleccion-link');
    const megaMenu = document.getElementById('mega-menu');
    
    if (coleccionLink && megaMenu) {
        coleccionLink.addEventListener('click', (e) => {
            e.preventDefault();
            megaMenu.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!coleccionLink.contains(e.target) && !megaMenu.contains(e.target)) {
                megaMenu.classList.remove('show');
            }
        });
    }
});
