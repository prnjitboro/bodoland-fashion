const SUPABASE_URL = "https://vtrpbwhupdqzegchyoha.supabase.co";
const SUPABASE_KEY = "sb_publishable_GSAPqd9xHsp0BkkVYHdrNQ_zw37bsNm";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allProducts = [];
let selectedItem = null;

// Modal for placing orders
const modalHTML = `
  <div id="orderModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9999; align-items:center; justify-content:center; padding:15px;">
    <div style="background:#fff; border-radius:12px; padding:20px; width:100%; max-width:380px; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
      <h3 id="modalTitle" style="margin-top:0; color:#111;">Place Order</h3>
      <p id="modalPrice" style="color:#059669; font-weight:bold; margin-bottom:12px;">₹0</p>
      <input type="text" id="custName" placeholder="Your Name" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;" required />
      <input type="tel" id="custPhone" placeholder="Mobile Number" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;" required />
      <textarea id="custAddress" rows="3" placeholder="Full Delivery Address" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;" required></textarea>
      <div style="display:flex; gap:8px;">
        <button onclick="closeModal()" style="flex:1; padding:10px; border:1px solid #cbd5e1; background:#f1f5f9; border-radius:6px; cursor:pointer; font-weight:600;">Cancel</button>
        <button id="submitBtn" onclick="submitOrder()" style="flex:1; padding:10px; border:none; background:#000; color:#fff; border-radius:6px; cursor:pointer; font-weight:600;">Confirm Order</button>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

async function loadProducts() {
  const container = document.querySelector('.products-grid') || document.querySelector('.product-grid') || document.querySelector('section.products-section > div:last-child') || document.getElementById('products') || document.getElementById('productGrid');
  
  if (!container) return;
  container.innerHTML = "<p style='grid-column: 1/-1; text-align:center; color:#64748b; padding:20px;'>Connecting to live store...</p>";

  const { data, error } = await client.from("products").select("*").order("id", { ascending: false });

  if (error || !data || data.length === 0) {
    container.innerHTML = "<p style='grid-column: 1/-1; text-align:center; color:#64748b; padding:20px;'>No products added yet. Add items from Admin Panel.</p>";
    return;
  }

  allProducts = data;
  renderProducts(allProducts);
}

function renderProducts(items) {
  const container = document.querySelector('.products-grid') || document.querySelector('.product-grid') || document.querySelector('section.products-section > div:last-child') || document.getElementById('products') || document.getElementById('productGrid');
  if (!container) return;

  container.innerHTML = items.map(p => `
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="width:100%; height:220px; background:#f8fafc;">
        <img src="${p.image_url || 'https://via.placeholder.com/250x220?text=No+Image'}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <div style="padding:14px; display:flex; flex-direction:column; flex-grow:1;">
        <span style="font-size:0.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase;">${p.category || 'Fashion'}</span>
        <div style="font-size:1rem; font-weight:600; margin:4px 0 6px; color:#0f172a;">${p.name}</div>
        <div style="font-size:1.1rem; font-weight:700; color:#0f172a; margin-bottom:12px;">₹${Number(p.price).toFixed(2)}</div>
        <button onclick="openModal('${p.name}', ${p.price}, ${p.id})" style="width:100%; background:#111; border:none; color:#fff; padding:10px; border-radius:6px; font-weight:600; cursor:pointer; margin-top:auto;">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

window.openModal = function(name, price, id) {
  selectedItem = { name, price, id };
  document.getElementById("modalTitle").innerText = name;
  document.getElementById("modalPrice").innerText = "₹" + Number(price).toFixed(2);
  document.getElementById("orderModal").style.display = "flex";
};

window.closeModal = function() {
  document.getElementById("orderModal").style.display = "none";
};

window.submitOrder = async function() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill all details!");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.innerText = "Placing order...";
  btn.disabled = true;

  const orderData = {
    customer_name: name,
    phone: phone,
    address: address,
    total: selectedItem.price,
    items: [{ product: selectedItem.name, price: selectedItem.price, qty: 1 }]
  };

  const { error } = await client.from("orders").insert([orderData]);

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Order placed successfully! Sent to Admin Panel.");
    closeModal();
  }
  btn.innerText = "Confirm Order";
  btn.disabled = false;
};

loadProducts();
