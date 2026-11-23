import { initLayout } from '../components/layout.js';
import { store } from '../services/store.js';
import { productService } from '../services/products.js';
import { toast } from '../components/toast.js';
import { formatCurrency } from '../utils/helpers.js';
import { createIcons, Heart, ShoppingBag, X } from 'lucide';

const icons = { Heart, ShoppingBag, X };

document.addEventListener('DOMContentLoaded', () => {
  initLayout('wishlist');

  const wishlistGrid = document.getElementById('wishlist-grid');
  const wishlistEmpty = document.getElementById('wishlist-empty');
  const wishlistCountEl = document.getElementById('wishlist-item-count');

  // Modal elements
  const sizeModal = document.getElementById('size-select-modal');
  const sizeModalBackdrop = document.getElementById('size-modal-backdrop');
  const closeSizeModalBtn = document.getElementById('close-size-modal');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  const modalImg = document.getElementById('modal-product-img');
  const modalBrand = document.getElementById('modal-product-brand');
  const modalName = document.getElementById('modal-product-name');
  const modalPrice = document.getElementById('modal-product-price');
  const modalSizesContainer = document.getElementById('modal-sizes-container');
  const modalSizeError = document.getElementById('modal-size-error');

  let pendingMoveProduct = null;
  let selectedModalSize = null;

  function renderWishlist() {
    const items = store.getWishlist();

    if (wishlistCountEl) {
      wishlistCountEl.textContent = `${items.length} ${items.length === 1 ? 'Piece' : 'Pieces'}`;
    }

    if (items.length === 0) {
      if (wishlistGrid) wishlistGrid.classList.add('hidden');
      if (wishlistEmpty) wishlistEmpty.classList.remove('hidden');
      return;
    }

    if (wishlistGrid) wishlistGrid.classList.remove('hidden');
    if (wishlistEmpty) wishlistEmpty.classList.add('hidden');

    if (wishlistGrid) {
      wishlistGrid.innerHTML = items.map((item) => {
        const fullProd = productService.getById(item.id) || item;
        const discountText = fullProd.discountPercent 
          ? `(${fullProd.discountPercent}% OFF)` 
          : (fullProd.originalPrice && fullProd.originalPrice > fullProd.price) 
            ? `(${Math.round(((fullProd.originalPrice - fullProd.price) / fullProd.originalPrice) * 100)}% OFF)` 
            : '';

        return `
          <article class="group relative flex flex-col bg-white border border-[#eae8e3] rounded-none overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#121212]/30">
            
            <!-- 3:4 Image Container -->
            <div class="relative w-full aspect-[3/4] bg-[#f5f4ef] overflow-hidden">
              <a href="/product.html?id=${item.id}" class="block w-full h-full">
                <img 
                  src="${item.image}" 
                  alt="${item.name}" 
                  class="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500" 
                  loading="lazy"
                />
              </a>

              <!-- Dismiss / Remove Button -->
              <button 
                type="button"
                data-remove-id="${item.id}" 
                class="btn-remove-wishlist absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#737373] hover:text-[#121212] hover:bg-white transition shadow-xs z-10 flex items-center justify-center cursor-pointer" 
                title="Remove from Curation"
                aria-label="Remove ${item.name} from curation"
              >
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <!-- Content Details -->
            <div class="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
              <div>
                <span class="text-[9px] font-bold tracking-[0.18em] text-[#737373] uppercase block mb-1 truncate">
                  ${item.brand}
                </span>
                <a href="/product.html?id=${item.id}" class="text-xs sm:text-sm font-normal text-[#121212] line-clamp-1 hover:text-[#525252] transition">
                  ${item.name}
                </a>

                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-xs sm:text-sm font-bold text-[#121212]">${formatCurrency(item.price)}</span>
                  ${item.originalPrice && item.originalPrice > item.price ? `
                    <span class="text-[11px] text-[#a3a3a3] line-through font-light">${formatCurrency(item.originalPrice)}</span>
                    <span class="text-[10px] font-bold text-[#c25e40]">${discountText}</span>
                  ` : ''}
                </div>
              </div>

              <!-- High-Visibility Move to Bag Action -->
              <button 
                type="button"
                data-move-id="${item.id}" 
                class="btn-move-bag w-full bg-[#121212] hover:bg-black text-[#faf9f6] text-[11px] font-bold tracking-[0.14em] uppercase py-3 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                <span>Move to Bag</span>
              </button>
            </div>

          </article>
        `;
      }).join('');
    }

    createIcons({ icons });
  }

  // Open Size Modal for Move-to-Bag
  function openSizeSelectionModal(product) {
    pendingMoveProduct = product;
    selectedModalSize = null;

    if (modalImg) modalImg.src = product.image;
    if (modalBrand) modalBrand.textContent = product.brand;
    if (modalName) modalName.textContent = product.name;
    if (modalPrice) modalPrice.textContent = formatCurrency(product.price);
    if (modalSizeError) modalSizeError.classList.add('hidden');

    // Retrieve available sizes from catalogue or default set
    const fullProd = productService.getById(product.id);
    const availableSizes = (fullProd && fullProd.sizes && fullProd.sizes.length > 0) 
      ? fullProd.sizes 
      : ['XS', 'S', 'M', 'L', 'XL'];

    if (modalSizesContainer) {
      modalSizesContainer.innerHTML = availableSizes.map((s) => `
        <button 
          type="button" 
          data-size="${s}" 
          class="modal-size-pill border border-[#eae8e3] bg-white text-[#121212] text-xs font-semibold py-2.5 px-4 hover:border-[#121212] transition cursor-pointer"
        >
          ${s}
        </button>
      `).join('');

      // Add click handler to pills
      modalSizesContainer.querySelectorAll('.modal-size-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
          modalSizesContainer.querySelectorAll('.modal-size-pill').forEach((p) => {
            p.classList.remove('bg-[#121212]', 'text-white', 'border-[#121212]');
            p.classList.add('bg-white', 'text-[#121212]', 'border-[#eae8e3]');
          });

          pill.classList.add('bg-[#121212]', 'text-white', 'border-[#121212]');
          pill.classList.remove('bg-white', 'text-[#121212]', 'border-[#eae8e3]');
          selectedModalSize = pill.dataset.size;
          if (modalSizeError) modalSizeError.classList.add('hidden');
        });
      });
    }

    if (sizeModal) sizeModal.classList.remove('hidden');
  }

  function closeSizeModal() {
    if (sizeModal) sizeModal.classList.add('hidden');
    pendingMoveProduct = null;
    selectedModalSize = null;
  }

  if (closeSizeModalBtn) closeSizeModalBtn.addEventListener('click', closeSizeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeSizeModal);
  if (sizeModalBackdrop) sizeModalBackdrop.addEventListener('click', closeSizeModal);

  // Confirm Move to Bag
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      if (!selectedModalSize) {
        if (modalSizeError) modalSizeError.classList.remove('hidden');
        toast.show('Please select a size before adding to bag');
        return;
      }

      if (pendingMoveProduct) {
        const fullProd = productService.getById(pendingMoveProduct.id) || pendingMoveProduct;
        store.addToCart(fullProd, selectedModalSize, 1);
        store.removeFromWishlist(pendingMoveProduct.id);
        toast.success(`Allocated "${pendingMoveProduct.name}" (${selectedModalSize}) to Bag`);
        closeSizeModal();
        renderWishlist();
      }
    });
  }

  // Handle Wishlist Grid Actions
  if (wishlistGrid) {
    wishlistGrid.addEventListener('click', (e) => {
      // Remove Action
      const removeBtn = e.target.closest('.btn-remove-wishlist');
      if (removeBtn) {
        const id = removeBtn.dataset.removeId;
        store.removeFromWishlist(id);
        toast.show('Removed piece from Curation');
        renderWishlist();
        return;
      }

      // Move to Bag Action -> Opens Size Modal
      const moveBtn = e.target.closest('.btn-move-bag');
      if (moveBtn) {
        const id = moveBtn.dataset.moveId;
        const item = store.getWishlist().find((w) => w.id === id);
        if (item) {
          openSizeSelectionModal(item);
        }
      }
    });
  }

  renderWishlist();
});
