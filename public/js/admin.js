// ==========================================================================
// CHICAGO WINGS - LÓGICA DEL ADMINISTRADOR (ADMIN.JS)
// ==========================================================================

// --- Estado de la Administración ---
let allOrders = [];
let currentFilter = 'Todos';
let searchQuery = '';
let isUserLoggedIn = false;
let pollingIntervalId = null;

// --- Elementos del DOM ---
const loginOverlay = document.getElementById("login-overlay");
const loginForm = document.getElementById("login-form");
const adminPassInput = document.getElementById("admin-pass");
const adminDashboardContent = document.getElementById("admin-dashboard-content");
const refreshOrdersBtn = document.getElementById("refresh-orders-btn");
const ordersListContainer = document.getElementById("orders-list");
const noOrdersMsg = document.getElementById("no-orders-msg");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

// Elementos de Estadísticas
const statPending = document.getElementById("stat-pending");
const statPreparing = document.getElementById("stat-preparing");
const statDelivered = document.getElementById("stat-delivered");
const notificationSound = document.getElementById("notification-sound");
const paymentSound = document.getElementById("payment-sound");
const adminNotificationsContainer = document.getElementById("admin-notifications");

// --- Inicialización ---
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  setupAdminEvents();
});

// --- Verificar sesión existente ---
function checkSession() {
  const session = sessionStorage.getItem("chicago_admin_logged");
  if (session === "true") {
    loginSuccess();
  }
}

function loginSuccess() {
  isUserLoggedIn = true;
  loginOverlay.classList.remove("active");
  adminDashboardContent.style.display = "block";
  
  // Cargar pedidos e iniciar actualización automática (polling)
  fetchOrders();
  startPolling();
}

// --- Configurar Eventos ---
function setupAdminEvents() {
  // Manejo de Login
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = adminPassInput.value;
    
    // Contraseña súper simple para demostración
    if (password === "chicago123") {
      sessionStorage.setItem("chicago_admin_logged", "true");
      loginSuccess();
    } else {
      alert("Contraseña incorrecta. Por favor intenta de nuevo (Pista: chicago123)");
      adminPassInput.value = "";
      adminPassInput.focus();
    }
  });

  // Botón de Actualizar Manual
  refreshOrdersBtn.addEventListener("click", () => {
    fetchOrders(true); // Forzar actualización visual con spinner
  });

  // Filtros de estado
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.status;
      renderOrders();
    });
  });

  // Buscador
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderOrders();
  });
}

// --- Polling (Actualización automática) ---
function startPolling() {
  // Evitar duplicados
  if (pollingIntervalId) clearInterval(pollingIntervalId);
  
  pollingIntervalId = setInterval(() => {
    if (isUserLoggedIn) {
      fetchOrders(false); // Silencioso en fondo
    }
  }, 10000); // Cada 10 segundos
}

// --- Obtener pedidos de la API ---
async function fetchOrders(showSpinner = false) {
  if (showSpinner) {
    refreshOrdersBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
    refreshOrdersBtn.disabled = true;
  }

  try {
    const response = await fetch('/api/orders');
    if (!response.ok) throw new Error('Error al consultar pedidos');
    
    const orders = await response.json();
    
    // Verificar si hay nuevos pedidos o nuevos pagos
    if (allOrders.length > 0) {
      // 1. Verificar si hay nuevos pedidos generales (no pagados) para reproducir sonido de alerta general
      const hasNewPendings = orders.some(newOrder => 
        newOrder.status === 'Pendiente' && 
        !allOrders.some(oldOrder => oldOrder.id === newOrder.id)
      );
      
      // 2. Verificar si hay pedidos que acaban de marcarse como pagados o nuevos pagados
      let payAlertTriggered = false;
      orders.forEach(newOrder => {
        const oldOrder = allOrders.find(o => o.id === newOrder.id);
        const justPaid = (oldOrder && !oldOrder.isPaid && newOrder.isPaid) ||
                         (!oldOrder && newOrder.isPaid);
        if (justPaid) {
          playPaymentSound();
          showAdminPaymentNotification(newOrder);
          payAlertTriggered = true;
        }
      });

      // Si no se activó alerta de pago pero hay pedidos nuevos normales, sonar alerta normal
      if (hasNewPendings && !payAlertTriggered) {
        playNotificationSound();
      }
    }
    
    allOrders = orders;
    updateStats();
    renderOrders();

  } catch (error) {
    console.error('Error cargando órdenes:', error);
  } finally {
    if (showSpinner) {
      refreshOrdersBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Actualizar';
      refreshOrdersBtn.disabled = false;
    }
  }
}

// --- Actualizar Estadísticas ---
function updateStats() {
  const pending = allOrders.filter(o => o.status === 'Pendiente').length;
  const preparing = allOrders.filter(o => o.status === 'Preparando').length;
  const delivered = allOrders.filter(o => o.status === 'Entregado').length;

  statPending.textContent = pending;
  statPreparing.textContent = preparing;
  statDelivered.textContent = delivered;
}

// --- Renderizar Pedidos ---
function renderOrders() {
  // Limpiar contenedor (excluyendo el mensaje vacío por defecto)
  const orderCards = ordersListContainer.querySelectorAll(".order-card");
  orderCards.forEach(card => card.remove());

  // Filtrar pedidos
  let filteredOrders = allOrders;

  // Filtrar por estado
  if (currentFilter !== 'Todos') {
    filteredOrders = filteredOrders.filter(o => o.status === currentFilter);
  }

  // Filtrar por búsqueda
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(o => 
      o.customerName.toLowerCase().includes(searchQuery) ||
      o.customerPhone.includes(searchQuery) ||
      o.customerAddress.toLowerCase().includes(searchQuery)
    );
  }

  if (filteredOrders.length === 0) {
    noOrdersMsg.style.display = "block";
    return;
  }

  noOrdersMsg.style.display = "none";

  filteredOrders.forEach(order => {
    const card = document.createElement("div");
    card.className = `order-card status-${order.status.toLowerCase()}`;
    card.id = `order-card-${order.id}`;

    // Formatear Fecha
    const orderDate = new Date(order.date).toLocaleString('es-CO');

    // Generar HTML de los ítems
    let itemsHtml = "";
    order.items.forEach(item => {
      let optsText = "";
      if (item.options) {
        const opts = [];
        if (item.options.size) opts.push(`Tamaño: ${item.options.size}`);
        if (item.options.potatoType) opts.push(`Papas: ${item.options.potatoType}`);
        if (item.options.sauces && item.options.sauces.length > 0) {
          opts.push(`Salsas: ${item.options.sauces.join(', ')}`);
        }
        optsText = opts.join(' | ');
      }

      itemsHtml += `
        <li class="admin-item-row">
          <div>
            <span class="admin-item-qty">${item.quantity}x</span>
            <span class="admin-item-name">${item.name}</span>
            ${optsText ? `<span class="admin-item-opts">${optsText}</span>` : ''}
          </div>
          <span>$${formatNumber(item.price * item.quantity)}</span>
        </li>
      `;
    });

    card.innerHTML = `
      <div class="order-card-header">
        <div class="order-id-date">
          <span class="order-id-badge">PEDIDO #${order.id}</span>
          <span class="order-date"><i class="fa-regular fa-clock"></i> ${orderDate}</span>
        </div>
        <div class="order-status-control">
          <label for="status-select-${order.id}">Estado:</label>
          <select class="order-status-select" id="status-select-${order.id}" data-id="${order.id}">
            <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Preparando" ${order.status === 'Preparando' ? 'selected' : ''}>Preparando</option>
            <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
            <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
            <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </div>
      </div>
      <div class="order-card-body">
        <div class="order-cust-details">
          <h4>Datos del Cliente</h4>
          <dl class="details-grid">
            <dt>Cliente:</dt>
            <dd><strong>${order.customerName}</strong></dd>
            
            <dt>Teléfono:</dt>
            <dd>${order.customerPhone}</dd>
            
            <dt>Dirección:</dt>
            <dd>${order.customerAddress}</dd>
            
            <dt>Pago:</dt>
            <dd>
              <span class="badge-vintage" style="margin-bottom:0; font-size:12px; padding:2px 8px;">${order.paymentMethod}</span>
              ${order.isPaid ? `<span class="badge-success" style="background-color: #28a745; color: white; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-left: 5px; text-transform: uppercase; display: inline-flex; align-items: center; gap: 3px; vertical-align: middle;"><i class="fa-solid fa-circle-check"></i> Pagado</span>` : ''}
            </dd>
          </dl>
        </div>
        <div class="order-items-detail">
          <h4>Productos</h4>
          <ul class="admin-items-list">
            ${itemsHtml}
          </ul>
          <div class="admin-order-total">
            <span>Total:</span>
            <span style="color:var(--color-primary);">$${formatNumber(order.total)}</span>
          </div>
        </div>
      </div>
      <div class="order-actions">
        <a href="https://wa.me/57${order.customerPhone.replace(/\D/g, '')}" target="_blank" class="whatsapp-action-btn">
          <i class="fa-brands fa-whatsapp"></i> Chatear con cliente
        </a>
      </div>
    `;

    // Evento para cambiar el estado del pedido
    card.querySelector(".order-status-select").addEventListener("change", (e) => {
      const orderId = e.target.dataset.id;
      const newStatus = e.target.value;
      updateOrderStatus(orderId, newStatus);
    });

    ordersListContainer.appendChild(card);
  });
}

// --- Actualizar Estado de Pedido ---
async function updateOrderStatus(id, newStatus) {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) throw new Error('Error al actualizar el estado del pedido');

    const updatedOrder = await response.json();
    
    // Actualizar en memoria
    const index = allOrders.findIndex(o => o.id === parseInt(id));
    if (index > -1) {
      allOrders[index].status = updatedOrder.status;
    }

    // Efecto visual en la tarjeta
    const card = document.getElementById(`order-card-${id}`);
    if (card) {
      // Eliminar clases antiguas y agregar nueva
      card.className = `order-card status-${updatedOrder.status.toLowerCase()}`;
    }

    updateStats();
    
    // Si el filtro actual es diferente de "Todos" y el estado cambió, re-renderizar para ocultarlo si corresponde
    if (currentFilter !== 'Todos') {
      renderOrders();
    }

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    alert('No se pudo actualizar el estado del pedido. Intenta de nuevo.');
  }
}

// --- Sonido de Notificación ---
function playNotificationSound() {
  if (notificationSound) {
    notificationSound.play().catch(err => {
      console.log("Audio no pudo reproducirse automáticamente (políticas del navegador).", err);
    });
  }
}

// --- Sonido de Notificación de Pago ---
function playPaymentSound() {
  if (paymentSound) {
    paymentSound.play().catch(err => {
      console.log("Audio de pago no pudo reproducirse automáticamente.", err);
    });
  }
}

// --- Mostrar Notificación de Pago en Panel ---
function showAdminPaymentNotification(order) {
  if (!adminNotificationsContainer) return;
  
  // Inyectar estilos para animaciones si no están presentes
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      @keyframes toast-in {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toast-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(120%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: white;
    border-left: 5px solid #28a745;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 280px;
    pointer-events: auto;
    animation: toast-in 0.3s ease-out forwards;
  `;
  
  toast.innerHTML = `
    <div style="background: rgba(40, 167, 69, 0.1); color: #28a745; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
      <i class="fa-solid fa-money-bill-wave"></i>
    </div>
    <div style="flex: 1; text-align: left;">
      <h4 style="margin: 0; font-size: 13px; color: #333; font-family: Outfit, sans-serif;">¡Pago Confirmado!</h4>
      <p style="margin: 2px 0 0 0; font-size: 11px; color: #666; font-family: Outfit, sans-serif;">Pedido #${order.id} - ${order.customerName} pagó con ${order.paymentMethod}</p>
    </div>
    <button style="border: none; background: none; color: #aaa; cursor: pointer; font-size: 16px; padding: 0 5px;" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  adminNotificationsContainer.appendChild(toast);
  
  // Ocultar automáticamente tras 6 segundos
  setTimeout(() => {
    toast.style.animation = "toast-out 0.3s ease-in forwards";
    setTimeout(() => toast.remove(), 300);
  }, 6000);
}

// --- Helpers ---
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
