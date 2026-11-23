import { initLayout } from '../components/layout.js';
import { store } from '../services/store.js';
import { toast } from '../components/toast.js';
import { formatCurrency } from '../utils/helpers.js';
import { createIcons, CheckCircle2, ShieldCheck, Check, ArrowRight } from 'lucide';

const icons = { CheckCircle2, ShieldCheck, Check, ArrowRight };

document.addEventListener('DOMContentLoaded', () => {
  initLayout('checkout');

  const items = store.getCart();
  const totals = store.getCartTotals();

  const summaryList = document.getElementById('checkout-items-summary');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const discountEl = document.getElementById('checkout-discount');
  const shippingEl = document.getElementById('checkout-shipping');
  const totalAmountEl = document.getElementById('checkout-total');
  const payBtn = document.getElementById('place-order-btn');
  const modal = document.getElementById('order-success-modal');
  const orderIdSpan = document.getElementById('order-id-display');

  // Address edit toggles
  const editAddressBtn = document.getElementById('edit-address-btn');
  const savedAddressCard = document.getElementById('saved-address-card');
  const shippingForm = document.getElementById('shipping-form');
  const cancelAddressBtn = document.getElementById('cancel-address-btn');

  // Address fields
  const savedName = document.getElementById('saved-name');
  const savedPhone = document.getElementById('saved-phone');
  const savedAddress = document.getElementById('saved-full-address');

  const inputName = document.getElementById('input-name');
  const inputPhone = document.getElementById('input-phone');
  const inputHouse = document.getElementById('input-house');
  const inputLocality = document.getElementById('input-locality');
  const inputCity = document.getElementById('input-city');
  const inputPincode = document.getElementById('input-pincode');

  const SHIPPING_STORAGE_KEY = 'aurelia_shipping_address';

  function getSavedAddress() {
    try {
      const raw = localStorage.getItem(SHIPPING_STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (
        data &&
        typeof data.name === 'string' && data.name.trim() &&
        typeof data.phone === 'string' && data.phone.trim() &&
        typeof data.house === 'string' && data.house.trim() &&
        typeof data.loc === 'string' && data.loc.trim() &&
        typeof data.city === 'string' && data.city.trim() &&
        typeof data.pin === 'string' && data.pin.trim()
      ) {
        return data;
      }
      return null;
    } catch {
      return null;
    }
  }

  function applyAddressToUI(addr) {
    if (!addr) return;
    if (savedName) savedName.textContent = addr.name;
    const cleanPhone = addr.phone.replace(/^\+?91\s*/, '');
    if (savedPhone) savedPhone.textContent = `+91 ${cleanPhone}`;
    if (savedAddress) savedAddress.textContent = `${addr.house}, ${addr.loc}, ${addr.city} — ${addr.pin}`;

    if (inputName) inputName.value = addr.name;
    if (inputPhone) inputPhone.value = cleanPhone;
    if (inputHouse) inputHouse.value = addr.house;
    if (inputLocality) inputLocality.value = addr.loc;
    if (inputCity) inputCity.value = addr.city;
    if (inputPincode) inputPincode.value = addr.pin;
  }

  // Restore saved delivery address on page load
  const initialSavedAddr = getSavedAddress();
  if (initialSavedAddr) {
    applyAddressToUI(initialSavedAddr);
  }

  // Address editing event listeners
  if (editAddressBtn && shippingForm && savedAddressCard) {
    editAddressBtn.addEventListener('click', () => {
      savedAddressCard.classList.add('hidden');
      shippingForm.classList.remove('hidden');
    });
  }

  if (cancelAddressBtn && shippingForm && savedAddressCard) {
    cancelAddressBtn.addEventListener('click', () => {
      const currentSaved = getSavedAddress();
      if (currentSaved) {
        applyAddressToUI(currentSaved);
      }
      shippingForm.classList.add('hidden');
      savedAddressCard.classList.remove('hidden');
    });
  }

  if (shippingForm) {
    shippingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = inputName.value.trim();
      const phone = inputPhone.value.trim();
      const house = inputHouse.value.trim();
      const loc = inputLocality.value.trim();
      const city = inputCity.value.trim();
      const pin = inputPincode.value.trim();

      if (!name || !phone || !house || !loc || !city || !pin) {
        toast.show('Please fill in all address fields');
        return;
      }

      const addressData = { name, phone, house, loc, city, pin };
      try {
        localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(addressData));
      } catch (err) {
        console.warn('Could not persist address to localStorage:', err);
      }

      applyAddressToUI(addressData);

      shippingForm.classList.add('hidden');
      if (savedAddressCard) savedAddressCard.classList.remove('hidden');
      toast.success('Delivery address updated and saved');
    });
  }

  // Payment Option selection styling
  const paymentCards = document.querySelectorAll('.payment-option-card');
  paymentCards.forEach((card) => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', () => {
        paymentCards.forEach((c) => {
          c.classList.remove('border-[#121212]', 'bg-[#faf9f6]');
          c.classList.add('border-[#eae8e3]', 'bg-white');
        });
        if (radio.checked) {
          card.classList.add('border-[#121212]', 'bg-[#faf9f6]');
          card.classList.remove('border-[#eae8e3]', 'bg-white');
        }
      });
    }
  });

  // Render totals & Line items
  const effectiveShipping = totals.subtotal >= 1999 ? 0 : 250;
  const finalValuation = totals.subtotal + effectiveShipping;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (discountEl) discountEl.textContent = `- ${formatCurrency(totals.discount)}`;
  if (shippingEl) shippingEl.textContent = effectiveShipping === 0 ? 'COMPLIMENTARY' : formatCurrency(effectiveShipping);
  if (totalAmountEl) totalAmountEl.textContent = formatCurrency(finalValuation);

  if (summaryList) {
    if (items.length === 0) {
      summaryList.innerHTML = `
        <div class="py-6 text-center text-xs text-[#737373]">
          Your bag has no items. <a href="/shop.html" class="text-[#121212] underline font-bold">Browse collection</a>.
        </div>
      `;
    } else {
      summaryList.innerHTML = items.map((i) => `
        <div class="flex items-center gap-3 py-3">
          <img src="${i.image}" alt="${i.name}" class="w-12 h-16 object-cover bg-[#f5f4ef] shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="text-[9px] uppercase tracking-wider text-[#737373] block truncate">${i.brand}</span>
            <h4 class="text-xs font-medium text-[#121212] truncate">${i.name}</h4>
            <div class="flex items-center gap-2 text-[11px] text-[#525252] mt-0.5">
              <span>Qty: ${i.quantity}</span>
              <span>&bull;</span>
              <span>Size: ${i.selectedSize || 'M'}</span>
            </div>
          </div>
          <span class="text-xs font-bold text-[#121212] shrink-0">${formatCurrency(i.price * i.quantity)}</span>
        </div>
      `).join('');
    }
  }

  // Order Placement Demo
  if (payBtn) {
    payBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (items.length === 0) {
        toast.error('Cannot proceed: Your shopping bag is currently empty.');
        return;
      }

      // Generate bespoke Atelier Order Reference
      const randomOrderRef = 'AUR-2026-' + Math.floor(100000 + Math.random() * 900000);
      if (orderIdSpan) orderIdSpan.textContent = randomOrderRef;

      // Persist order to aurelia_orders for Account Orders & Returns tab
      try {
        const existingRaw = localStorage.getItem('aurelia_orders');
        const ordersList = existingRaw ? JSON.parse(existingRaw) : [];
        const savedAddr = getSavedAddress() || { name: 'Arjun Singhania', house: '402 Monolith', loc: 'Indiranagar', city: 'Bengaluru', pin: '560038' };
        const newOrder = {
          id: randomOrderRef,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'Confirmed',
          statusBadge: 'Confirmed • Processing',
          statusColor: 'emerald',
          total: finalValuation,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            brand: i.brand,
            selectedSize: i.selectedSize || 'M',
            quantity: i.quantity,
            price: i.price,
            image: i.image,
          })),
          address: savedAddr,
        };
        ordersList.unshift(newOrder);
        localStorage.setItem('aurelia_orders', JSON.stringify(ordersList));
      } catch (err) {
        console.warn('Could not persist order:', err);
      }

      // Clear cart
      store.clearCart();

      // Show success modal
      if (modal) modal.classList.remove('hidden');
      toast.success('Order allocation confirmed (Atelier Demo)!');
    });
  }

  createIcons({ icons });
});
