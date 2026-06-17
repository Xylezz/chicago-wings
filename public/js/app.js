// ==========================================================================
// CHICAGO WINGS - LÓGICA DEL CLIENTE (APP.JS)
// ==========================================================================

// --- Base de Datos del Menú ---
const MENU_DATA = {
  alitas: [
    {
      id: "combo-1",
      name: "Combo #1",
      price: 22500,
      desc: "4 Alitas + 2 Salsas + Papas Casco o Francesa",
      image: "assets/hero.png",
      options: {
        sauceCount: 2,
        potatoRequired: true
      }
    },
    {
      id: "combo-2",
      name: "Combo #2",
      price: 27500,
      desc: "6 Alitas + 2 Salsas + Papas Casco o Francesa",
      image: "assets/hero.png",
      options: {
        sauceCount: 2,
        potatoRequired: true
      }
    },
    {
      id: "combo-3",
      name: "Combo #3",
      price: 41000,
      desc: "12 Alitas + 3 Salsas + Papas Casco o Francesa",
      image: "assets/hero.png",
      options: {
        sauceCount: 3,
        potatoRequired: true
      }
    },
    {
      id: "combo-4",
      name: "Combo #4",
      price: 67000,
      desc: "24 Alitas + 4 Salsas + Papas Casco o Francesa",
      image: "assets/hero.png",
      options: {
        sauceCount: 4,
        potatoRequired: true
      }
    }
  ],
  papas: [
    {
      id: "papas-casa",
      name: "Papas de la Casa",
      price: 20000, // Precio base para Pequeña, se modifica por tamaño
      desc: "Base de papas casco o francesa + Queso + Carne o Pollo + Guacamole + Pico de gallo + Sour cream + Salsa de la casa",
      image: "assets/hero.png",
      options: {
        hasSizes: true,
        sizes: [
          { name: "Pequeña", price: 20000 },
          { name: "Grande", price: 30000 }
        ],
        potatoRequired: true,
        sauceSelectable: true
      }
    },
    {
      id: "papas-rancheras",
      name: "Papas Rancheras",
      price: 20000,
      desc: "Base de papas casco o francesa + Queso + Maíz + Tocineta + Salchicha ranchera + Huevo + BBQ Maple + Salsa de la casa",
      image: "assets/hero.png",
      options: {
        hasSizes: true,
        sizes: [
          { name: "Pequeña", price: 20000 },
          { name: "Grande", price: 30000 }
        ],
        potatoRequired: true,
        sauceSelectable: true
      }
    },
    {
      id: "salchipapa",
      name: "Salchipapa",
      price: 12000,
      desc: "Base de papa casco o francesa + Salchicha + Huevo + Salsa al gusto",
      image: "assets/hero.png",
      options: {
        potatoRequired: true,
        sauceSelectable: true
      }
    }
  ],
  adiciones: [
    { id: "add-ala", name: "Ala adicional", price: 3000, desc: "Ala de pollo extra", image: "assets/hero.png" },
    { id: "add-papas", name: "Porción de papas", price: 8000, desc: "Porción extra de papas casco/francesa", image: "assets/hero.png" },
    { id: "add-queso", name: "Queso adicional", price: 4000, desc: "Queso extra fundido", image: "assets/hero.png" },
    { id: "add-tocineta", name: "Tocineta adicional", price: 5000, desc: "Tocineta extra crujiente", image: "assets/hero.png" },
    { id: "add-guaca", name: "Guacamole", price: 3000, desc: "Porción extra de guacamole", image: "assets/hero.png" },
    { id: "add-pico", name: "Pico de gallo", price: 2000, desc: "Porción extra de pico de gallo", image: "assets/hero.png" },
    { id: "add-sour", name: "Sour cream", price: 3000, desc: "Porción extra de crema agria", image: "assets/hero.png" },
    { id: "add-salchicha", name: "Salchicha adicional", price: 3000, desc: "Salchicha adicional picada", image: "assets/hero.png" }
  ],
  bebidas: [
    { id: "beb-gaseosa-400", name: "Gaseosa 400ml", price: 5000, desc: "Gaseosa personal bien fría", image: "assets/hero.png" },
    { id: "beb-gaseosa-15", name: "Gaseosa 1.5 Litros", price: 8000, desc: "Para compartir en familia", image: "assets/hero.png" },
    { id: "beb-hit-litro", name: "Jugo Hit 1 Litro", price: 7000, desc: "Jugo en caja familiar", image: "assets/hero.png" },
    { id: "beb-hit-500", name: "Jugo Hit 500ml", price: 4000, desc: "Jugo en caja mediano", image: "assets/hero.png" },
    { id: "beb-hatsu", name: "Soda Hatsu", price: 5000, desc: "Soda saborizada Premium", image: "assets/hero.png" },
    { id: "beb-bretana", name: "Bretaña 300ml", price: 4000, desc: "Agua con gas / Mezclador", image: "assets/hero.png" },
    { id: "beb-agua", name: "Agua Botella", price: 3000, desc: "Agua natural purificada", image: "assets/hero.png" },
    { id: "beb-aguila", name: "Cerveza Águila", price: 5000, desc: "Cerveza nacional fría", image: "assets/hero.png" },
    { id: "beb-bud", name: "Cerveza Budweiser", price: 3500, desc: "Cerveza importada en lata", image: "assets/hero.png" }
  ]
};

// Salsas disponibles para Alitas
const SALSAS_ALITAS = [
  "BBQ Maple",
  "Miel Mostaza",
  "Teriyaki",
  "Maracuyá Picante",
  "Chile Dulce (Picante Medio)",
  "Búfalo (Picante)"
];

// Salsas disponibles para Papas / Salchipapas
const SALSAS_PAPAS = [
  "Rosada",
  "Piña",
  "Maíz",
  "BBQ",
  "Roja",
  "De la Casa (A base de Ajo)"
];

// --- Estado de la Aplicación ---
let cart = [];
let currentProductToCustomize = null;

// --- Elementos del DOM ---
const menuGrid = document.getElementById("menu-grid");
const tabButtons = document.querySelectorAll(".tab-btn");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-drawer-overlay");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartBadge = document.getElementById("cart-badge");
const emptyCart = document.getElementById("empty-cart");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartFooter = document.getElementById("cart-footer");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartShipping = document.getElementById("cart-shipping");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");
const deliveryTypeRadios = document.getElementsByName("delivery-type");
const addressGroup = document.getElementById("address-group");
const custAddress = document.getElementById("cust-address");
const paymentMethodSelect = document.getElementById("payment-method");

// Modal Elements
const customModal = document.getElementById("custom-modal");
const customModalOverlay = document.getElementById("custom-modal-overlay");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const modalConfirmBtn = document.getElementById("modal-confirm-btn");
const modalBody = document.getElementById("modal-body");
const modalTitle = document.getElementById("modal-title");

// Mobile Menu
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navMenu = document.getElementById("nav-menu");

// --- Lógica de Inicialización ---
document.addEventListener("DOMContentLoaded", () => {
  renderMenu("alitas");
  setupEventListeners();
  loadCartFromLocalStorage();
  updateCartUI();
});

// --- Configuración de Eventos ---
function setupEventListeners() {
  // Tabs del menú
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderMenu(button.dataset.category);
    });
  });

  // Carrito Drawer abrir/cerrar
  cartToggleBtn.addEventListener("click", toggleCart);
  cartCloseBtn.addEventListener("click", toggleCart);
  cartOverlay.addEventListener("click", toggleCart);

  // Menú móvil
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    mobileMenuBtn.querySelector("i").classList.toggle("fa-bars");
    mobileMenuBtn.querySelector("i").classList.toggle("fa-xmark");
  });

  // Cerrar menú móvil al hacer click en un link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      }
    });
  });

  // Domicilio vs Recoger
  deliveryTypeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "recoger") {
        addressGroup.style.display = "none";
        custAddress.removeAttribute("required");
      } else {
        addressGroup.style.display = "block";
        custAddress.setAttribute("required", "");
      }
      updateCartUI(); // Recalcular envío
    });
  });

  // Cambio de método de pago
  if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      const destAccountDetails = document.getElementById("destination-account-details");
      if (val === "Nequi" || val === "Bancolombia") {
        securePaymentFields.style.display = "block";
        payAccountNum.setAttribute("required", "");
        payHolder.setAttribute("required", "");
        payDoc.setAttribute("required", "");
        
        // Ajustar labels y cuenta destino según banco
        if (val === "Nequi") {
          payAccountLabel.textContent = "Número de Celular Nequi *";
          payAccountNum.placeholder = "Ej. 3012289416";
          if (destAccountDetails) destAccountDetails.innerHTML = `<i class="fa-solid fa-mobile-screen"></i> Nequi: <strong>3116624868</strong>`;
        } else {
          payAccountLabel.textContent = "Número de Cuenta Bancolombia *";
          payAccountNum.placeholder = "Ej. 123456789";
          if (destAccountDetails) destAccountDetails.innerHTML = `<i class="fa-solid fa-money-check"></i> Bancolombia Ahorros: <strong>01500052968</strong>`;
        }
        
        // Cargar datos guardados previamente de forma segura/privada
        loadSavedPaymentDetails(val);
      } else {
        securePaymentFields.style.display = "none";
        payAccountNum.removeAttribute("required");
        payHolder.removeAttribute("required");
        payDoc.removeAttribute("required");
      }
    });
  }

  // Eventos Modal
  modalCloseBtn.addEventListener("click", closeModal);
  modalCancelBtn.addEventListener("click", closeModal);
  customModalOverlay.addEventListener("click", closeModal);
  modalConfirmBtn.addEventListener("click", addCustomizedItemToCart);

  // Botón "Ver carta" de carrito vacío
  document.getElementById("go-to-menu-btn").addEventListener("click", toggleCart);

  // Formulario de Pago/Envío
  checkoutForm.addEventListener("submit", processOrder);
}

// --- Renderizar Menú ---
function renderMenu(category) {
  menuGrid.innerHTML = "";
  const items = MENU_DATA[category];

  if (!items) return;

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-item";
    
    // Formatear descripción
    let descHtml = item.desc;
    
    card.innerHTML = `
      <div class="menu-item-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="menu-item-img">
      </div>
      <div class="menu-item-info">
        <div class="menu-item-header">
          <h3 class="menu-item-title">${item.name}</h3>
          <span class="menu-item-price">$${formatNumber(item.price)}</span>
        </div>
        <p class="menu-item-desc">${descHtml}</p>
        <div class="menu-item-footer">
          <button class="btn btn-outline btn-block btn-small add-btn" data-id="${item.id}" data-category="${category}">
            <i class="fa-solid fa-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;

    // Evento del botón de agregar
    card.querySelector(".add-btn").addEventListener("click", () => {
      handleAddItem(item, category);
    });

    menuGrid.appendChild(card);
  });
}

// --- Manejar el agregado del Producto ---
function handleAddItem(item, category) {
  // Si no requiere personalización, agregar directo
  if (!item.options) {
    addToCart(item, {});
    showToast(`¡${item.name} agregado al carrito!`);
    return;
  }

  // Si requiere personalización, abrir modal
  openCustomizationModal(item, category);
}

// --- Modal de Personalización ---
function openCustomizationModal(item, category) {
  currentProductToCustomize = { item, category };
  modalTitle.textContent = `Personaliza tu ${item.name}`;
  modalBody.innerHTML = "";

  const options = item.options;

  // 1. Selector de tamaño si aplica
  if (options.hasSizes) {
    const section = document.createElement("div");
    section.className = "modal-section";
    section.innerHTML = `
      <h4>Selecciona Tamaño</h4>
      <div class="option-grid">
        ${options.sizes.map((sz, index) => `
          <div class="opt-card ${index === 0 ? 'selected' : ''}" data-type="size" data-name="${sz.name}" data-price="${sz.price}">
            <input type="radio" name="size-select" ${index === 0 ? 'checked' : ''}>
            <span>${sz.name} ($${formatNumber(sz.price)})</span>
          </div>
        `).join('')}
      </div>
    `;
    modalBody.appendChild(section);

    // Eventos para seleccionar tarjeta en lugar de solo radio
    setupModalCardSelection(section);
  }

  // 2. Tipo de Papas (si aplica)
  if (options.potatoRequired) {
    const section = document.createElement("div");
    section.className = "modal-section";
    section.innerHTML = `
      <h4>Tipo de Papas</h4>
      <div class="option-grid">
        <div class="opt-card selected" data-type="potato" data-value="Casco">
          <input type="radio" name="potato-select" checked>
          <span>Papas en Casco</span>
        </div>
        <div class="opt-card" data-type="potato" data-value="Francesa">
          <input type="radio" name="potato-select">
          <span>Papas a la Francesa</span>
        </div>
      </div>
    `;
    modalBody.appendChild(section);
    setupModalCardSelection(section);
  }

  // 3. Selección de Salsas
  if (options.sauceCount) {
    // Para combos de alitas, requiere N salsas
    const section = document.createElement("div");
    section.className = "modal-section";
    section.innerHTML = `
      <h4>Selecciona tus ${options.sauceCount} Salsas</h4>
      <p style="font-size:11px; color:var(--color-dark-muted); margin-bottom:10px;">Puedes elegir la misma salsa más de una vez si lo deseas.</p>
      <div class="sauces-select-container" style="display:flex; flex-direction:column; gap:10px;">
        ${Array.from({ length: options.sauceCount }).map((_, idx) => `
          <div class="form-group" style="margin-bottom:5px;">
            <label style="font-size:12px;">Salsa ${idx + 1}</label>
            <select class="sauce-dropdown" required>
              ${SALSAS_ALITAS.map(salsa => `<option value="${salsa}">${salsa}</option>`).join('')}
            </select>
          </div>
        `).join('')}
      </div>
    `;
    modalBody.appendChild(section);
  } else if (options.sauceSelectable) {
    // Para papas/salchipapas, puede seleccionar hasta 2 salsas
    const section = document.createElement("div");
    section.className = "modal-section";
    section.innerHTML = `
      <h4>Selecciona tus Salsas (Máx. 2)</h4>
      <div class="option-grid">
        ${SALSAS_PAPAS.map(salsa => `
          <div class="opt-card" data-type="sauce-multi" data-value="${salsa}">
            <input type="checkbox" name="sauce-check">
            <span>${salsa}</span>
          </div>
        `).join('')}
      </div>
    `;
    modalBody.appendChild(section);
    setupModalCheckboxSelection(section, 2);
  }

  // Mostrar el modal
  customModal.classList.add("active");
  customModalOverlay.classList.add("active");
}

function setupModalCardSelection(parentSection) {
  const cards = parentSection.querySelectorAll(".opt-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => {
        c.classList.remove("selected");
        c.querySelector("input[type='radio']").checked = false;
      });
      card.classList.add("selected");
      card.querySelector("input[type='radio']").checked = true;
    });
  });
}

function setupModalCheckboxSelection(parentSection, maxAllowed) {
  const cards = parentSection.querySelectorAll(".opt-card");
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      const checkbox = card.querySelector("input[type='checkbox']");
      
      // Evitar doble evento si hicieron click en el checkbox
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      const selectedCount = parentSection.querySelectorAll("input[type='checkbox']:checked").length;

      if (selectedCount > maxAllowed) {
        checkbox.checked = false;
        alert(`Solo puedes elegir un máximo de ${maxAllowed} salsas.`);
        return;
      }

      if (checkbox.checked) {
        card.classList.add("selected");
      } else {
        card.classList.remove("selected");
      }
    });
  });
}

function closeModal() {
  customModal.classList.remove("active");
  customModalOverlay.classList.remove("active");
  currentProductToCustomize = null;
}

// --- Agregar Item Personalizado al Carrito ---
function addCustomizedItemToCart() {
  if (!currentProductToCustomize) return;

  const { item, category } = currentProductToCustomize;
  const optionsSelected = {};
  let finalPrice = item.price;

  // Obtener tamaño si aplica
  if (item.options.hasSizes) {
    const selectedSizeCard = modalBody.querySelector(".opt-card[data-type='size'].selected");
    optionsSelected.size = selectedSizeCard.dataset.name;
    finalPrice = parseFloat(selectedSizeCard.dataset.price);
  }

  // Obtener tipo de papas
  if (item.options.potatoRequired) {
    const selectedPotatoCard = modalBody.querySelector(".opt-card[data-type='potato'].selected");
    optionsSelected.potatoType = selectedPotatoCard.dataset.value;
  }

  // Obtener salsas de combo de alitas
  if (item.options.sauceCount) {
    const dropdowns = modalBody.querySelectorAll(".sauce-dropdown");
    const sauces = [];
    dropdowns.forEach(dd => {
      sauces.push(dd.value);
    });
    optionsSelected.sauces = sauces;
  }

  // Obtener salsas de papas (multi-check)
  if (item.options.sauceSelectable) {
    const checkedCards = modalBody.querySelectorAll(".opt-card[data-type='sauce-multi'].selected");
    const sauces = [];
    checkedCards.forEach(c => {
      sauces.push(c.dataset.value);
    });
    optionsSelected.sauces = sauces;
  }

  addToCart(item, optionsSelected, finalPrice);
  closeModal();
  showToast(`¡${item.name} agregado al carrito!`);
}

// --- Lógica Básica del Carrito ---
function addToCart(item, options, customPrice = null) {
  const price = customPrice !== null ? customPrice : item.price;
  
  // Generar llave de unicidad basada en el ID y las opciones (para agrupar iguales)
  const optionsKey = JSON.stringify(options);

  const existingItemIndex = cart.findIndex(cartItem => 
    cartItem.id === item.id && JSON.stringify(cartItem.options) === optionsKey
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: price,
      options: options,
      quantity: 1
    });
  }

  saveCartToLocalStorage();
  updateCartUI();
}

function updateCartUI() {
  // Actualizar Badge
  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartBadge.textContent = totalQty;

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartItemsContainer.innerHTML = "";
    cartFooter.style.display = "none";
    return;
  }

  emptyCart.style.display = "none";
  cartFooter.style.display = "block";
  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    
    // Crear tarjeta de ítem de carrito
    const itemCard = document.createElement("div");
    itemCard.className = "cart-item";

    // Formatear opciones
    let optionsText = "";
    if (item.options) {
      const opts = [];
      if (item.options.size) opts.push(`Tamaño: ${item.options.size}`);
      if (item.options.potatoType) opts.push(`Papas: ${item.options.potatoType}`);
      if (item.options.sauces && item.options.sauces.length > 0) {
        opts.push(`Salsas: ${item.options.sauces.join(', ')}`);
      }
      optionsText = opts.join(' | ');
    }

    itemCard.innerHTML = `
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        ${optionsText ? `<p class="cart-item-customizations">${optionsText}</p>` : ''}
        <div class="cart-item-bottom">
          <span class="cart-item-price">$${formatNumber(item.price * item.quantity)}</span>
          <div class="qty-controls">
            <button class="qty-btn dec-btn" data-index="${index}">-</button>
            <div class="qty-val">${item.quantity}</div>
            <button class="qty-btn inc-btn" data-index="${index}">+</button>
          </div>
        </div>
      </div>
      <button class="cart-item-remove remove-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
    `;

    // Eventos de cantidad y eliminar
    itemCard.querySelector(".dec-btn").addEventListener("click", () => changeQty(index, -1));
    itemCard.querySelector(".inc-btn").addEventListener("click", () => changeQty(index, 1));
    itemCard.querySelector(".remove-btn").addEventListener("click", () => removeCartItem(index));

    cartItemsContainer.appendChild(itemCard);
  });

  // Calcular totales
  const isDelivery = document.querySelector('input[name="delivery-type"]:checked').value === "domicilio";
  const total = subtotal;

  cartSubtotal.textContent = `$${formatNumber(subtotal)}`;
  
  if (isDelivery) {
    cartShipping.textContent = "Por acordar";
    cartShipping.style.fontWeight = "bold";
    cartShipping.style.color = "var(--color-primary)";
    cartTotal.innerHTML = `$${formatNumber(total)} <span style="font-size:11px; font-weight:normal; display:block; color:var(--color-dark-muted); margin-top:2px;">+ costo de envío (por acordar)</span>`;
  } else {
    cartShipping.textContent = "$0";
    cartShipping.style.fontWeight = "normal";
    cartShipping.style.color = "inherit";
    cartTotal.textContent = `$${formatNumber(total)}`;
  }
}

function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCartToLocalStorage();
  updateCartUI();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCartToLocalStorage();
  updateCartUI();
}

function toggleCart() {
  cartDrawer.classList.toggle("active");
  cartOverlay.classList.toggle("active");
}

// --- Persistencia del Carrito ---
function saveCartToLocalStorage() {
  localStorage.setItem("chicago_wings_cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("chicago_wings_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
}

// --- Procesar Pedido (Checkout) ---
async function processOrder(e) {
  e.preventDefault();

  const checkoutBtn = document.getElementById("checkout-submit-btn");
  checkoutBtn.disabled = true;
  checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';

  const customerName = document.getElementById("cust-name").value;
  const customerPhone = document.getElementById("cust-phone").value;
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
  const address = deliveryType === "domicilio" ? custAddress.value : "Retiro en local";
  const paymentMethod = document.getElementById("payment-method").value;

  // Calcular subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  // Estructurar pedido para el Backend
  const orderPayload = {
    customerName,
    customerPhone,
    customerAddress: address,
    paymentMethod,
    items: cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      options: item.options
    })),
    total: total,
    isPaid: false
  };

  try {
    // 1. Guardar en el Backend
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      throw new Error('Error al registrar pedido en el servidor');
    }

    const savedOrder = await response.json();

    // 2. Mostrar toast de éxito
    showToastNotification();

    // 3. Formatear mensaje para WhatsApp
    const message = formatWhatsAppMessage(savedOrder, subtotal, deliveryType);
    const whatsappUrl = `https://wa.me/573012289416?text=${encodeURIComponent(message)}`;

    // 4. Limpiar carrito
    cart = [];
    saveCartToLocalStorage();
    updateCartUI();
    checkoutForm.reset();

    // 5. Redirigir a WhatsApp después de una breve pausa
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      toggleCart();
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Confirmar y Enviar por WhatsApp';
    }, 2000);

  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al procesar tu pedido. Por favor intenta de nuevo.');
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Confirmar y Enviar por WhatsApp';
  }
}

// Formatear Mensaje de WhatsApp
function formatWhatsAppMessage(order, subtotal, deliveryType) {
  let msg = `🍔 *CHICAGO WINGS - NUEVO PEDIDO #${order.id}* 🍔\n\n`;
  msg += `👤 *Cliente:* ${order.customerName}\n`;
  msg += `📞 *Teléfono:* ${order.customerPhone}\n`;
  msg += `📍 *Dirección:* ${order.customerAddress}\n`;
  msg += `💵 *Método de Pago:* ${order.paymentMethod}\n`;
  msg += `📅 *Fecha:* ${new Date(order.date).toLocaleString('es-CO')}\n`;
  msg += `-------------------------------------------\n\n`;
  msg += `🛒 *Detalle del Pedido:*\n`;

  order.items.forEach(item => {
    msg += `• *${item.quantity}x* ${item.name} ($${formatNumber(item.price * item.quantity)})\n`;
    
    // Opciones del item
    if (item.options) {
      const opts = [];
      if (item.options.size) opts.push(`  - Tamaño: ${item.options.size}`);
      if (item.options.potatoType) opts.push(`  - Papas: ${item.options.potatoType}`);
      if (item.options.sauces && item.options.sauces.length > 0) {
        opts.push(`  - Salsas: ${item.options.sauces.join(', ')}`);
      }
      if (opts.length > 0) {
        msg += opts.join('\n') + `\n`;
      }
    }
  });

  msg += `\n-------------------------------------------\n`;
  msg += `💰 *Subtotal:* $${formatNumber(subtotal)}\n`;
  if (deliveryType === "domicilio") {
    msg += `🛵 *Envío:* Por coordinar con asesor por WhatsApp\n`;
    msg += `🌟 *Total productos:* $${formatNumber(order.total)}\n\n`;
    msg += `_(El valor final del envío y los detalles de transferencia se coordinarán por WhatsApp con el asesor)_\n\n`;
  } else {
    msg += `🛵 *Envío:* Gratis (Retiro en local)\n`;
    msg += `🌟 *Total a Pagar:* $${formatNumber(order.total)}\n\n`;
  }
  msg += `¡Muchas gracias por elegir Chicago Wings! Estaremos procesando su pedido en breve.`;

  return msg;
}

// --- Helpers ---
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function showToast(text) {
  // Toast flotante opcional
  console.log(text);
}

function showToastNotification() {
  const toast = document.getElementById("toast");
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 4000);
}
