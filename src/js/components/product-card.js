import { formatCurrency } from '../utils/helpers.js';
import { store } from '../services/store.js';
import { toast } from './toast.js';
import { createIcons, Heart, Star, ShoppingBag, Check } from 'lucide';

const icons = { Heart, Star, ShoppingBag, Check };

export function createProductCard(product) {
  const isWishlisted = store.isInWishlist(product.id);
  const hasSecondaryImage = product.images && product.images.length > 1;

  return `
    <article class="group relative flex flex-col bg-white border border-[#eae8e3] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-300" data-card-id="${product.id}">
      
      <!-- Visual Display Container (3:4 ratio) -->
      <div class="relative w-full aspect-[3/4] bg-[#f8f8f9] overflow-hidden">
        <a href="/product.html?id=${product.id}" class="block w-full h-full relative" aria-label="View ${product.name}">
          <!-- Primary Image -->
          <img 
            src="${product.images[0]}" 
            alt="${product.name}" 
            class="w-full h-full object-cover object-center transition-opacity duration-500 ${hasSecondaryImage ? 'group-hover:opacity-0' : 'hover-reveal-img'}"
            loading="lazy"
          />

          <!-- Secondary Image Preview on Hover -->
          ${hasSecondaryImage ? `
            <img 
              src="${product.images[1]}" 
              alt="${product.name} back view" 
              class="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"
              loading="lazy"
            />
          ` : ''}
        </a>

        <!-- Myntra-Style Rating Pill (Bottom-Left) -->
        ${product.rating ? `
          <div class="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-gray-900 border border-gray-200/90 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1 z-10 pointer-events-none shadow-xs">
            <span>${product.rating}</span>
            <i data-lucide="star" class="w-2.5 h-2.5 fill-amber-500 text-amber-500"></i>
            <span class="text-gray-300 font-light">|</span>
            <span class="text-gray-600 font-medium">${product.reviewCount || 120}</span>
          </div>
        ` : ''}

        <!-- Wishlist Heart Button (Top-Right) -->
        <button 
          type="button"
          data-wishlist-id="${product.id}"
          class="wishlist-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm text-[#262626] hover:text-[#121212] hover:bg-white flex items-center justify-center transition-all shadow-xs z-20 cursor-pointer"
          title="Save to Wishlist"
          aria-label="Toggle wishlist for ${product.name}"
        >
          <i data-lucide="heart" class="w-3.5 h-3.5 ${isWishlisted ? 'fill-[#121212] text-[#121212]' : ''}"></i>
        </button>

        <!-- Edition / Stock Badge -->
        ${product.badge ? `
          <div class="absolute top-2.5 left-2.5 bg-[#121212]/90 text-white text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 font-bold rounded-xs z-10">
            ${product.badge}
          </div>
        ` : ''}

        <!-- Desktop Hover Quick Add Size Bar (Myntra-Style Instant Strip) -->
        ${product.sizes && product.sizes.length ? `
          <div class="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs border-t border-gray-200 py-2.5 px-3 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 hidden md:flex z-20 shadow-md">
            <span class="text-[10px] uppercase tracking-wider text-gray-600 font-bold mb-1.5">Select Size</span>
            <div class="flex items-center gap-1.5 flex-wrap justify-center">
              ${product.sizes.map((s) => `
                <button 
                  type="button" 
                  data-quick-add-id="${product.id}" 
                  data-size="${s}" 
                  class="quick-add-size-btn px-2.5 py-1 text-[10px] font-bold border border-gray-300 bg-white text-gray-900 hover:bg-[#121212] hover:text-white hover:border-[#121212] rounded-xs transition cursor-pointer"
                  title="Add size ${s} to Bag"
                >
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Mobile Quick Add Trigger Button (Bottom-Right) -->
        <button 
          type="button" 
          data-mobile-quick-add="${product.id}" 
          class="mobile-quick-add-btn md:hidden absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center shadow-md z-20 cursor-pointer active:scale-95 transition" 
          title="Quick Add to Bag"
          aria-label="Quick Add to Bag"
        >
          <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-white"></i>
        </button>

        <!-- Mobile Inline Size Selector Sheet -->
        <div 
          id="mobile-size-sheet-${product.id}" 
          class="mobile-size-sheet hidden md:hidden absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-30 transition-all shadow-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] uppercase tracking-wider font-bold text-gray-900">Select Size</span>
            <button type="button" data-close-sheet="${product.id}" class="text-sm font-bold text-gray-500 hover:text-black">&times;</button>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${(product.sizes || ['Universal']).map((s) => `
              <button 
                type="button" 
                data-quick-add-id="${product.id}" 
                data-size="${s}" 
                class="quick-add-size-btn px-3 py-1.5 text-[11px] font-bold border border-gray-300 bg-white text-gray-900 active:bg-[#121212] active:text-white rounded-xs transition"
              >
                ${s}
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Marketplace Typography Details & Pricing -->
      <div class="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white space-y-1.5">
        <div>
          <span class="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 block truncate leading-tight">
            ${product.brand}
          </span>
          <a href="/product.html?id=${product.id}" class="text-xs text-gray-500 hover:text-gray-800 transition truncate block font-normal mt-0.5">
            ${product.name}
          </a>
        </div>

        <div class="pt-1 flex items-baseline gap-2 flex-wrap">
          <span class="text-xs sm:text-sm font-bold text-gray-900">${formatCurrency(product.price)}</span>
          ${product.originalPrice && product.originalPrice > product.price ? `
            <span class="text-[11px] text-gray-400 line-through">${formatCurrency(product.originalPrice)}</span>
            <span class="text-[10px] sm:text-[11px] font-bold text-[#c25e40]">(${product.discountPercent || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)</span>
          ` : ''}
        </div>
      </div>

    </article>
  `;
}

export function bindProductCardEvents(container, productsList) {
  if (!container) return;

  function closeAllMobileSheets() {
    document.querySelectorAll('.mobile-size-sheet').forEach((sheet) => {
      sheet.classList.add('hidden');
    });
  }

  // Ensure global outside click and Escape listener is attached once
  if (!document._mobileSizeSheetGlobalBound) {
    document._mobileSizeSheetGlobalBound = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllMobileSheets();
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-size-sheet') && !e.target.closest('.mobile-quick-add-btn')) {
        closeAllMobileSheets();
      }
    });
  }

  container.addEventListener('click', (e) => {
    // 1. Wishlist toggle
    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
      e.preventDefault();
      e.stopPropagation();

      const id = wishlistBtn.dataset.wishlistId;
      const product = productsList.find((p) => p.id === id);
      if (!product) return;

      const added = store.toggleWishlist(product);

      // Synchronize all visible instances of this product across the current page
      const allMatchingIcons = document.querySelectorAll(`[data-wishlist-id="${id}"] svg, [data-wishlist-id="${id}"] i`);
      allMatchingIcons.forEach((icon) => {
        if (added) {
          icon.classList.add('fill-[#121212]', 'text-[#121212]');
        } else {
          icon.classList.remove('fill-[#121212]', 'text-[#121212]');
        }
        icon.classList.add('scale-125');
        setTimeout(() => icon.classList.remove('scale-125'), 200);
      });

      // Also synchronize PDP main wishlist button if present for this piece
      const pdpWishlistBtn = document.getElementById('pdp-wishlist-btn');
      const pdpWishlistLabel = document.getElementById('pdp-wishlist-label');
      if (pdpWishlistBtn) {
        const pdpIcon = pdpWishlistBtn.querySelector('svg, i');
        if (pdpIcon && window.location.search.includes(id)) {
          if (added) {
            pdpIcon.classList.add('fill-[#121212]', 'text-[#121212]');
          } else {
            pdpIcon.classList.remove('fill-[#121212]', 'text-[#121212]');
          }
          if (pdpWishlistLabel) {
            pdpWishlistLabel.textContent = added ? 'Saved in Wishlist' : 'Save to Wishlist';
          }
        }
      }

      if (added) {
        toast.success(`Saved "${product.name}" to Wishlist`);
      } else {
        toast.show(`Removed from Wishlist`);
      }
      return;
    }

    // 2. Quick Add size button (desktop hover bar & mobile sheet)
    const quickAddBtn = e.target.closest('.quick-add-size-btn');
    if (quickAddBtn) {
      e.preventDefault();
      e.stopPropagation();

      const id = quickAddBtn.dataset.quickAddId;
      const size = quickAddBtn.dataset.size;
      const product = productsList.find((p) => p.id === id);
      if (!product) return;

      store.addToCart(product, size, 1);
      toast.success(`Added ${product.name} (${size}) to Bag`);

      // Close mobile sheet if open
      const sheet = container.querySelector(`#mobile-size-sheet-${id}`);
      if (sheet) {
        sheet.classList.add('hidden');
      }
      return;
    }

    // 3. Mobile Quick Add trigger button
    const mobileQuickAddBtn = e.target.closest('.mobile-quick-add-btn');
    if (mobileQuickAddBtn) {
      e.preventDefault();
      e.stopPropagation();

      const id = mobileQuickAddBtn.dataset.mobileQuickAdd;
      const product = productsList.find((p) => p.id === id);
      if (!product) return;

      // If single size, add immediately
      if (!product.sizes || product.sizes.length <= 1) {
        const size = (product.sizes && product.sizes[0]) || 'Universal';
        store.addToCart(product, size, 1);
        toast.success(`Added ${product.name} to Bag`);
        return;
      }

      // If multiple sizes, toggle mobile size selector sheet ensuring only one is open at a time
      const sheet = container.querySelector(`#mobile-size-sheet-${id}`);
      const isCurrentlyOpen = sheet && !sheet.classList.contains('hidden');

      closeAllMobileSheets();

      if (sheet && !isCurrentlyOpen) {
        sheet.classList.remove('hidden');
      }
      return;
    }

    // 4. Close mobile sheet button
    const closeBtn = e.target.closest('[data-close-sheet]');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = closeBtn.dataset.closeSheet;
      const sheet = container.querySelector(`#mobile-size-sheet-${id}`);
      if (sheet) {
        sheet.classList.add('hidden');
      }
      return;
    }
  });

  createIcons({ icons });
}
