import { initLayout } from '../components/layout.js';
import { store } from '../services/store.js';
import { toast } from '../components/toast.js';
import { formatCurrency } from '../utils/helpers.js';
import { 
  createIcons, 
  Trash2, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Check 
} from 'lucide';

const icons = {
  Trash2,
  ShoppingBag,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Check
};

document.addEventListener('DOMContentLoaded', () => {
  initLayout('cart');

  const cartList = document.getElementById('cart-items-list');
  const cartEmpty = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  const itemsCounter = document.getElementById('cart-items-counter');
  const summaryCount = document.getElementById('summary-items-count');

  const originalTotalEl = document.getElementById('cart-original-total');
  const mrpDiscountEl = document.getElementById('cart-mrp-discount');
  const couponDiscountEl = document.getElementById('cart-coupon-discount');
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const grandTotalEl = document.getElementById('cart-grand-total');

  const couponInput = document.getElementById('coupon-input');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const appliedBanner = document.getElementById('applied-coupon-banner');
  const appliedCodeSpan = document.getElementById('applied-coupon-code');
  const removeCouponBtn = document.getElementById('remove-coupon-btn');
  const couponChips = document.querySelectorAll('.coupon-chip');

  let activeCoupon = null;

  function renderCart() {
    const items = store.getCart();
    const totals = store.getCartTotals();

    if (items.length === 0) {
      if (cartContent) cartContent.classList.add('hidden');
      if (cartEmpty) cartEmpty.classList.remove('hidden');
      return;
    }

    if (cartContent) cartContent.classList.remove('hidden');
    if (cartEmpty) cartEmpty.classList.add('hidden');

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const countText = `${totalCount} ${totalCount === 1 ? 'Piece' : 'Pieces'}`;
    if (itemsCounter) itemsCounter.textContent = countText;
    if (summaryCount) summaryCount.textContent = countText;

    if (cartList) {
      cartList.innerHTML = items.map((item) => {
        const itemSavings = (item.originalPrice - item.price) * item.quantity;
        return `
          <article class="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white border border-[#eae8e3] rounded-none transition-shadow hover:shadow-xs">
            <a href="/product.html?id=${item.id}" class="shrink-0 self-center sm:self-start">
              <img 
                src="${item.image}" 
                alt="${item.name}" 
                class="w-24 h-32 sm:w-28 sm:h-36 object-cover bg-[#f5f4ef]" 
              />
            </a>
            
            <div class="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <div>
                    <span class="text-[10px] font-bold text-[#737373] uppercase tracking-[0.16em] block">${item.brand}</span>
                    <h3 class="text-xs sm:text-sm font-medium text-[#121212] mt-0.5">
                      <a href="/product.html?id=${item.id}" class="hover:text-[#525252] transition">${item.name}</a>
                    </h3>
                  </div>

                  <button 
                    type="button" 
                    data-remove-id="${item.id}" 
                    data-size="${item.selectedSize}" 
                    class="btn-remove text-[#a3a3a3] hover:text-red-600 transition p-1 cursor-pointer" 
                    title="Remove piece from bag"
                  >
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>

                <!-- Size & Fit Badge -->
                <div class="flex items-center gap-2 mt-2 text-xs text-[#525252]">
                  <span class="inline-flex items-center gap-1 bg-[#faf9f6] border border-[#eae8e3] px-2 py-0.5 text-[11px] font-semibold text-[#121212]">
                    Size: ${item.selectedSize || 'M'}
                  </span>
                  <span class="text-[11px] text-[#737373]">In Stock</span>
                </div>
              </div>

              <!-- Price & Quantity Row -->
              <div class="flex items-center justify-between pt-3 border-t border-[#eae8e3]/70 flex-wrap gap-2">
                <div class="flex items-baseline gap-2">
                  <span class="text-sm sm:text-base font-bold text-[#121212]">${formatCurrency(item.price * item.quantity)}</span>
                  ${item.originalPrice && item.originalPrice > item.price ? `
                    <span class="text-xs text-[#a3a3a3] line-through font-light">${formatCurrency(item.originalPrice * item.quantity)}</span>
                    <span class="text-[10px] font-bold text-[#c25e40]">Save ${formatCurrency(itemSavings)}</span>
                  ` : ''}
                </div>

                <!-- Quantity Increment / Decrement -->
                <div class="flex items-center border border-[#eae8e3] bg-[#faf9f6]">
                  <button 
                    type="button" 
                    data-qty-delta="-1" 
                    data-id="${item.id}" 
                    data-size="${item.selectedSize}" 
                    class="btn-qty px-3 py-1 text-xs font-bold text-[#121212] hover:bg-black/5 transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >-</button>
                  <span class="px-2.5 text-xs font-bold text-[#121212]">${item.quantity}</span>
                  <button 
                    type="button" 
                    data-qty-delta="1" 
                    data-id="${item.id}" 
                    data-size="${item.selectedSize}" 
                    class="btn-qty px-3 py-1 text-xs font-bold text-[#121212] hover:bg-black/5 transition cursor-pointer"
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>

              <!-- Action Footer: Remove & Move to Wishlist -->
              <div class="flex items-center justify-between pt-2 border-t border-[#eae8e3]/40 text-xs">
                <button 
                  type="button" 
                  data-remove-id="${item.id}" 
                  data-size="${item.selectedSize}" 
                  class="btn-remove text-[11px] font-semibold uppercase tracking-wider text-[#737373] hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>Remove</span>
                </button>

                <button 
                  type="button" 
                  data-wishlist-id="${item.id}" 
                  data-size="${item.selectedSize}" 
                  class="btn-move-wishlist text-[11px] font-semibold uppercase tracking-wider text-[#121212] hover:text-[#c25e40] transition flex items-center gap-1 cursor-pointer"
                >
                  <i data-lucide="heart" class="w-3.5 h-3.5"></i>
                  <span>Move to Wishlist</span>
                </button>
              </div>

            </div>
          </article>
        `;
      }).join('');
    }

    // Coupon Calculations
    let couponDiscount = 0;
    let effectiveShipping = totals.subtotal >= 1999 ? 0 : 250;

    if (activeCoupon === 'ATELIER2026') {
      effectiveShipping = 0; // Free express delivery
      couponDiscount = Math.round(totals.subtotal * 0.10); // 10% privilege discount
    } else if (activeCoupon === 'AURELIA10') {
      couponDiscount = 300; // Flat ₹300 courtesy
    }

    const mrpDiscount = totals.originalTotal - totals.subtotal;
    const finalTotal = Math.max(0, totals.subtotal - couponDiscount + effectiveShipping);

    // Update Price Details Elements
    if (originalTotalEl) originalTotalEl.textContent = formatCurrency(totals.originalTotal);
    if (mrpDiscountEl) mrpDiscountEl.textContent = `- ${formatCurrency(mrpDiscount)}`;
    if (couponDiscountEl) couponDiscountEl.textContent = couponDiscount > 0 ? `- ${formatCurrency(couponDiscount)}` : '₹0';
    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (shippingEl) shippingEl.textContent = effectiveShipping === 0 ? 'COMPLIMENTARY' : formatCurrency(effectiveShipping);
    if (grandTotalEl) grandTotalEl.textContent = formatCurrency(finalTotal);

    createIcons({ icons });
  }

  // Handle Cart Item Click Actions
  if (cartList) {
    cartList.addEventListener('click', (e) => {
      // Remove Button
      const removeBtn = e.target.closest('.btn-remove');
      if (removeBtn) {
        const id = removeBtn.dataset.removeId;
        const size = removeBtn.dataset.size;
        store.removeFromCart(id, size);
        toast.show('Piece removed from Bag');
        renderCart();
        return;
      }

      // Move to Wishlist Button
      const wishlistBtn = e.target.closest('.btn-move-wishlist');
      if (wishlistBtn) {
        const id = wishlistBtn.dataset.wishlistId;
        const size = wishlistBtn.dataset.size;
        const item = store.getCart().find((c) => c.id === id && c.selectedSize === size);
        if (item) {
          store.addToWishlist(item);
          store.removeFromCart(id, size);
          toast.success(`Moved "${item.name}" to Saved Curation`);
          renderCart();
        }
        return;
      }

      // Quantity Adjustment (+ / -)
      const qtyBtn = e.target.closest('.btn-qty');
      if (qtyBtn) {
        const id = qtyBtn.dataset.id;
        const size = qtyBtn.dataset.size;
        const delta = Number(qtyBtn.dataset.qtyDelta);
        store.updateCartQuantity(id, size, delta);
        renderCart();
      }
    });
  }

  // Coupon Application Logic
  function applyCouponCode(code) {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'ATELIER2026') {
      activeCoupon = 'ATELIER2026';
      if (appliedBanner) appliedBanner.classList.remove('hidden');
      if (appliedCodeSpan) appliedCodeSpan.textContent = 'ATELIER2026 (10% Off + Free Shipping)';
      if (couponInput) couponInput.value = '';
      toast.success('Privilege code ATELIER2026 applied!');
      renderCart();
    } else if (formatted === 'AURELIA10') {
      activeCoupon = 'AURELIA10';
      if (appliedBanner) appliedBanner.classList.remove('hidden');
      if (appliedCodeSpan) appliedCodeSpan.textContent = 'AURELIA10 (₹300 Privilege Courtesy)';
      if (couponInput) couponInput.value = '';
      toast.success('Privilege code AURELIA10 applied!');
      renderCart();
    } else {
      toast.error('Invalid privilege code. Try ATELIER2026 or AURELIA10');
    }
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      if (!couponInput.value.trim()) {
        toast.show('Please enter a privilege code');
        return;
      }
      applyCouponCode(couponInput.value);
    });
  }

  // Clickable Coupon Suggestions Chips
  couponChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const code = chip.dataset.code;
      applyCouponCode(code);
    });
  });

  // Remove Coupon Button
  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', () => {
      activeCoupon = null;
      if (appliedBanner) appliedBanner.classList.add('hidden');
      toast.show('Coupon privilege removed');
      renderCart();
    });
  }

  renderCart();
});
