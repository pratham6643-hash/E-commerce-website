import { initLayout } from '../components/layout.js';
import { productService } from '../services/products.js';
import { store } from '../services/store.js';
import { toast } from '../components/toast.js';
import { createProductCard, bindProductCardEvents } from '../components/product-card.js';
import { formatCurrency, calculateSavings } from '../utils/helpers.js';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { 
  createIcons, 
  Heart, 
  ShoppingBag, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  User,
  Truck,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide';

const icons = {
  Heart,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Truck,
  CheckCircle2,
  X,
  ArrowRight
};

// Module-level PDP state (avoids any temporal dead zone or scope isolation issues)
let currentProduct = null;
let currentProductId = 'aur-01';
let selectedSize = null;
let currentSwiperInstance = null;
let pswpLightbox = null;
let isPhotoSwipeOpen = false;

function initPDP() {
  initLayout('product');

  const allProducts = productService.getAll();
  const urlParams = new URLSearchParams(window.location.search);
  currentProductId = urlParams.get('id') || 'aur-01';

  // Load Initial Product
  loadProduct(currentProductId);

  // Handle Browser Back / Forward History Navigation
  window.addEventListener('popstate', (e) => {
    const id = e.state?.id || new URLSearchParams(window.location.search).get('id') || 'aur-01';
    loadProduct(id, false);
  });

  // Size Chart Modal Controls
  const sizeChartBtn = document.getElementById('open-size-chart-btn');
  const sizeChartModal = document.getElementById('size-chart-modal');
  const closeSizeChartBtn = document.getElementById('close-size-chart-btn');
  const sizeChartBackdrop = document.getElementById('size-chart-backdrop');

  if (sizeChartBtn && sizeChartModal) {
    sizeChartBtn.addEventListener('click', () => {
      sizeChartModal.classList.remove('hidden');
    });
  }

  const closeSizeChart = () => {
    if (sizeChartModal) sizeChartModal.classList.add('hidden');
  };

  if (closeSizeChartBtn) closeSizeChartBtn.addEventListener('click', closeSizeChart);
  if (sizeChartBackdrop) sizeChartBackdrop.addEventListener('click', closeSizeChart);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSizeChart();
  });

  // Size Chart Unit Toggle (Inches / CM)
  const unitInchesBtn = document.getElementById('unit-inches-btn');
  const unitCmBtn = document.getElementById('unit-cm-btn');
  const sizeChartInches = document.getElementById('size-chart-inches');
  const sizeChartCm = document.getElementById('size-chart-cm');
  const sizeChartUnitLabel = document.getElementById('size-chart-unit-label');

  if (unitInchesBtn && unitCmBtn && sizeChartInches && sizeChartCm) {
    unitInchesBtn.addEventListener('click', () => {
      unitInchesBtn.className = 'px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#121212] text-white transition cursor-pointer';
      unitInchesBtn.setAttribute('aria-selected', 'true');
      unitCmBtn.className = 'px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#737373] hover:text-[#121212] transition cursor-pointer';
      unitCmBtn.setAttribute('aria-selected', 'false');
      sizeChartInches.classList.remove('hidden');
      sizeChartCm.classList.add('hidden');
      if (sizeChartUnitLabel) sizeChartUnitLabel.textContent = 'Standard garment measurements in inches (Demo Guide)';
    });

    unitCmBtn.addEventListener('click', () => {
      unitCmBtn.className = 'px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#121212] text-white transition cursor-pointer';
      unitCmBtn.setAttribute('aria-selected', 'true');
      unitInchesBtn.className = 'px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#737373] hover:text-[#121212] transition cursor-pointer';
      unitInchesBtn.setAttribute('aria-selected', 'false');
      sizeChartCm.classList.remove('hidden');
      sizeChartInches.classList.add('hidden');
      if (sizeChartUnitLabel) sizeChartUnitLabel.textContent = 'Standard garment measurements in centimeters (1 in = 2.54 cm)';
    });
  }

  // Product-to-Product Touch Swipe on Buy Box / Information Zone
  initProductToProductSwipe();

  // Function to Load and Render a Product
  function loadProduct(productId, pushHistory = true) {
    const product = productService.getById(productId) || allProducts[0];
    if (!product) return;

    currentProductId = product.id;

    if (pushHistory) {
      const newUrl = `/product.html?id=${product.id}`;
      if (window.location.pathname + window.location.search !== newUrl) {
        window.history.pushState({ id: product.id }, '', newUrl);
      }
    }

    // Scroll smoothly to top on product change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update Document Title
    document.title = `${product.name} — AURELIA Atelier`;

    // Update Product-to-Product Navigation Stepper
    updateProductStepper(product);

    // Populate Breadcrumbs
    const breadcrumbCategory = document.getElementById('pdp-breadcrumb-category');
    const breadcrumbName = document.getElementById('pdp-breadcrumb-name');
    if (breadcrumbCategory) breadcrumbCategory.textContent = product.category || 'Atelier';
    if (breadcrumbName) breadcrumbName.textContent = product.name;

    // Populate Editorial Details
    const brandEl = document.getElementById('pdp-brand');
    const titleEl = document.getElementById('pdp-title');
    const priceEl = document.getElementById('pdp-price');
    const origPriceEl = document.getElementById('pdp-original-price');
    const discountEl = document.getElementById('pdp-discount');
    const ratingEl = document.getElementById('pdp-rating');
    const reviewsEl = document.getElementById('pdp-reviews');
    const descEl = document.getElementById('pdp-description');

    if (brandEl) brandEl.textContent = product.brand;
    if (titleEl) titleEl.textContent = product.name;
    if (priceEl) priceEl.textContent = formatCurrency(product.price);
    if (origPriceEl) {
      if (product.originalPrice && product.originalPrice > product.price) {
        origPriceEl.textContent = formatCurrency(product.originalPrice);
        origPriceEl.classList.remove('hidden');
      } else {
        origPriceEl.classList.add('hidden');
      }
    }
    if (discountEl) {
      if (product.discountPercent) {
        discountEl.textContent = `(${product.discountPercent}% OFF)`;
        discountEl.classList.remove('hidden');
      } else {
        discountEl.classList.add('hidden');
      }
    }
    if (ratingEl) ratingEl.textContent = product.rating || '4.8';
    if (reviewsEl) reviewsEl.textContent = `${product.reviewCount || 120} Reviews`;
    if (descEl) descEl.textContent = product.description;

    // Render Desktop 2-Column Photo Grid
    try {
      renderDesktopGrid(product);
    } catch (e) {
      console.warn('Error in renderDesktopGrid:', e);
    }

    // Render Mobile Swiper Slides
    try {
      renderMobileSwiper(product);
    } catch (e) {
      console.warn('Error in renderMobileSwiper:', e);
    }

    // Render Synchronized Thumbnails (Visible on both Desktop and Mobile when > 1 image)
    try {
      renderThumbnails(product);
    } catch (e) {
      console.warn('Error in renderThumbnails:', e);
    }

    // Setup PhotoSwipe Lightbox
    try {
      initPhotoSwipe();
    } catch (e) {
      console.warn('Error in initPhotoSwipe:', e);
    }

    // Sizing Logic
    setupSizeSelector(product);

    // Add-to-Bag & Wishlist Actions
    setupActions(product);

    // Setup Pincode Estimator
    try {
      setupPincodeChecker();
    } catch (e) {
      console.warn('Error in setupPincodeChecker:', e);
    }

    // Render Similar Products Rail
    try {
      renderSimilarProducts(product);
    } catch (e) {
      console.warn('Error in renderSimilarProducts:', e);
    }

    createIcons({ icons });
  }

  // Update Product Stepper (Previous / Next Product Controls)
  function updateProductStepper(product) {
    const currentIndex = allProducts.findIndex((p) => p.id === product.id);
    const prevBtn = document.getElementById('prev-product-btn');
    const nextBtn = document.getElementById('next-product-btn');
    const counterEl = document.getElementById('product-position-counter');

    if (counterEl) {
      counterEl.textContent = `Piece ${currentIndex + 1} of ${allProducts.length}`;
    }

    if (prevBtn) {
      prevBtn.disabled = currentIndex <= 0;
      prevBtn.onclick = () => {
        if (currentIndex > 0) {
          loadProduct(allProducts[currentIndex - 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
    }

    if (nextBtn) {
      nextBtn.disabled = currentIndex >= allProducts.length - 1;
      nextBtn.onclick = () => {
        if (currentIndex < allProducts.length - 1) {
          loadProduct(allProducts[currentIndex + 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
    }
  }

  // Desktop 2-Column Photo Grid with individual scroll anchors
  function renderDesktopGrid(product) {
    const desktopGrid = document.getElementById('pdp-desktop-grid');
    if (!desktopGrid) return;

    desktopGrid.innerHTML = product.images.map((img, idx) => `
      <div id="desktop-photo-${idx}" class="relative bg-[#f5f4ef] border border-[#eae8e3] overflow-hidden group">
        <a 
          href="${img}" 
          data-pswp-src="${img}" 
          data-pswp-width="1200" 
          data-pswp-height="1600" 
          class="pswp-gallery-item block w-full aspect-[3/4] cursor-zoom-in"
          title="Zoom inspection for ${product.name}"
        >
          <img 
            src="${img}" 
            alt="${product.name} detail photo ${idx + 1}" 
            class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          <span class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[9px] uppercase tracking-wider font-semibold text-[#121212] px-2 py-1 opacity-0 group-hover:opacity-100 transition shadow-xs pointer-events-none">
            Zoom
          </span>
        </a>
      </div>
    `).join('');
  }

  // Mobile Swiper Gallery
  function renderMobileSwiper(product) {
    const swiperWrapper = document.getElementById('swiper-wrapper');
    const counterBadge = document.getElementById('mobile-image-counter');

    if (swiperWrapper) {
      swiperWrapper.innerHTML = product.images.map((img) => `
        <div class="swiper-slide bg-[#f5f4ef] flex items-center justify-center relative">
          <a 
            href="${img}" 
            data-pswp-src="${img}" 
            data-pswp-width="1200" 
            data-pswp-height="1600" 
            class="pswp-gallery-item block w-full h-full cursor-zoom-in"
          >
            <img src="${img}" alt="${product.name}" class="w-full h-full object-cover" />
          </a>
        </div>
      `).join('');
    }

    if (counterBadge) {
      counterBadge.textContent = `1 / ${product.images.length}`;
    }

    // Destroy existing Swiper if present
    if (currentSwiperInstance) {
      currentSwiperInstance.destroy(true, true);
      currentSwiperInstance = null;
    }

    // Initialize Mobile Swiper
    currentSwiperInstance = new Swiper('.pdp-swiper', {
      modules: [Navigation],
      loop: false,
      speed: 350,
      navigation: {
        nextEl: '.pdp-nav-next',
        prevEl: '.pdp-nav-prev',
      },
      on: {
        slideChange: (swiper) => {
          if (counterBadge) {
            counterBadge.textContent = `${swiper.activeIndex + 1} / ${product.images.length}`;
          }
          updateActiveThumbnail(swiper.activeIndex);
        },
      },
    });
  }

  // Synchronized Thumbnails for both Desktop & Mobile
  function renderThumbnails(product) {
    const thumbnailsContainer = document.getElementById('pdp-thumbnails');
    if (!thumbnailsContainer) return;

    if (!product.images || product.images.length <= 1) {
      thumbnailsContainer.classList.add('hidden');
      thumbnailsContainer.innerHTML = '';
      return;
    }

    thumbnailsContainer.classList.remove('hidden');
    thumbnailsContainer.innerHTML = product.images.map((img, idx) => `
      <button 
        type="button" 
        data-slide-index="${idx}" 
        role="tab"
        aria-selected="${idx === 0 ? 'true' : 'false'}"
        aria-label="View photo ${idx + 1}"
        class="pdp-thumb-btn flex-shrink-0 w-[85px] h-[105px] bg-[#f5f4ef] border transition-all duration-200 cursor-pointer overflow-hidden p-0.5 focus:outline-none ${
          idx === 0 
            ? 'border-[#121212] ring-1 ring-[#121212] opacity-100' 
            : 'border-[#eae8e3] opacity-65 hover:opacity-100 hover:border-[#121212]'
        }"
      >
        <img src="${img}" alt="${product.name} thumbnail ${idx + 1}" class="w-full h-full object-cover object-top pointer-events-none" />
      </button>
    `).join('');

    thumbnailsContainer.onclick = (e) => {
      const btn = e.target.closest('.pdp-thumb-btn');
      if (!btn) return;
      const targetIndex = parseInt(btn.dataset.slideIndex, 10);
      if (isNaN(targetIndex)) return;

      updateActiveThumbnail(targetIndex);

      if (window.innerWidth < 1024 && currentSwiperInstance) {
        currentSwiperInstance.slideTo(targetIndex);
      } else {
        const targetPhoto = document.getElementById(`desktop-photo-${targetIndex}`);
        if (targetPhoto) {
          targetPhoto.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
  }

  function updateActiveThumbnail(activeIndex) {
    const thumbnailsContainer = document.getElementById('pdp-thumbnails');
    if (!thumbnailsContainer) return;

    thumbnailsContainer.querySelectorAll('.pdp-thumb-btn').forEach((btn, idx) => {
      const isActive = idx === activeIndex;
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        btn.classList.add('border-[#121212]', 'ring-1', 'ring-[#121212]', 'opacity-100');
        btn.classList.remove('border-[#eae8e3]', 'opacity-65');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } else {
        btn.classList.remove('border-[#121212]', 'ring-1', 'ring-[#121212]', 'opacity-100');
        btn.classList.add('border-[#eae8e3]', 'opacity-65');
      }
    });
  }

  // PhotoSwipe Lightbox
  function initPhotoSwipe() {
    if (pswpLightbox) {
      pswpLightbox.destroy();
      pswpLightbox = null;
    }

    try {
      pswpLightbox = new PhotoSwipeLightbox({
        gallery: '#pdp-main-container',
        children: 'a.pswp-gallery-item',
        pswpModule: () => import('photoswipe'),
        bgOpacity: 0.95,
        wheelToZoom: true,
        pinchToClose: true,
      });

      pswpLightbox.on('initialLayout', () => {
        isPhotoSwipeOpen = true;
      });

      pswpLightbox.on('destroy', () => {
        isPhotoSwipeOpen = false;
      });

      pswpLightbox.on('close', () => {
        isPhotoSwipeOpen = false;
        // Synchronize Swiper slide index when closed
        if (pswpLightbox?.pswp && currentSwiperInstance && window.innerWidth < 1024) {
          const viewedIndex = pswpLightbox.pswp.currIndex;
          if (!isNaN(viewedIndex) && viewedIndex !== currentSwiperInstance.activeIndex) {
            currentSwiperInstance.slideTo(viewedIndex);
          }
        }
      });

      pswpLightbox.init();
    } catch (err) {
      console.warn('PhotoSwipe init error:', err);
    }
  }

  // Size Selector Setup
  function setupSizeSelector(product) {
    const sizeContainer = document.getElementById('size-selector');
    const sizeWarning = document.getElementById('size-warning');
    if (!sizeContainer) return;

    const availableSizes = Array.isArray(product.sizes) && product.sizes.length > 0 
      ? product.sizes 
      : ['Standard'];
      
    const isSingleSize = availableSizes.length === 1 && (
      availableSizes[0] === 'One Size' || 
      availableSizes[0] === 'Universal' || 
      availableSizes[0] === 'Standard'
    );

    // Single-size pieces (bags, eyewear) are pre-selected; multi-size apparel/footwear require user choice
    selectedSize = isSingleSize ? availableSizes[0] : null;

    sizeContainer.innerHTML = availableSizes.map((s) => {
      const isSelected = selectedSize === s;
      return `
        <button 
          type="button" 
          data-size="${s}" 
          role="radio"
          aria-checked="${isSelected ? 'true' : 'false'}"
          class="size-pill min-w-[54px] h-11 px-4 text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
            isSelected 
              ? 'border-[#121212] bg-[#121212] text-white shadow-xs' 
              : 'border-[#eae8e3] text-[#121212] bg-white hover:border-[#121212]'
          }"
        >
          ${s}
        </button>
      `;
    }).join('');

    if (sizeWarning) sizeWarning.classList.add('hidden');
  }

  // Reliable Event Delegation on size-selector container
  const sizeSelectorEl = document.getElementById('size-selector');
  if (sizeSelectorEl) {
    sizeSelectorEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.size-pill');
      if (!btn) return;

      const size = btn.dataset.size || btn.textContent.trim();
      selectedSize = size;

      // Update all buttons in container
      sizeSelectorEl.querySelectorAll('.size-pill').forEach((b) => {
        const bSize = b.dataset.size || b.textContent.trim();
        const active = bSize === size;
        b.setAttribute('aria-checked', active ? 'true' : 'false');
        if (active) {
          b.className = 'size-pill min-w-[54px] h-11 px-4 text-xs font-bold border transition-all cursor-pointer flex items-center justify-center border-[#121212] bg-[#121212] text-white shadow-xs';
        } else {
          b.className = 'size-pill min-w-[54px] h-11 px-4 text-xs font-bold border transition-all cursor-pointer flex items-center justify-center border-[#eae8e3] text-[#121212] bg-white hover:border-[#121212]';
        }
      });

      const sizeWarning = document.getElementById('size-warning');
      if (sizeWarning) sizeWarning.classList.add('hidden');
    });
  }

  // Action CTAs (Add to Bag & Wishlist)
  function setupActions(product) {
    currentProduct = product;
    const addToBagBtn = document.getElementById('add-to-bag-btn');
    const wishlistBtn = document.getElementById('pdp-wishlist-btn');
    const wishlistLabel = document.getElementById('pdp-wishlist-label');
    const sizeWarning = document.getElementById('size-warning');
    const sizeContainer = document.getElementById('size-selector');

    if (addToBagBtn) {
      addToBagBtn.onclick = (e) => {
        if (e) e.preventDefault();
        
        const activeProd = currentProduct || product;
        if (!activeProd) return;

        if (!selectedSize) {
          if (sizeWarning) {
            sizeWarning.classList.remove('hidden');
          }
          if (sizeContainer) {
            sizeContainer.classList.add('shake-anim');
            setTimeout(() => sizeContainer.classList.remove('shake-anim'), 500);
          }
          toast.show('Please select an available size before adding to bag');
          return;
        }

        // Add to bag in store
        store.addToCart(activeProd, selectedSize, 1);
        toast.success(`Allocated "${activeProd.name}" (Size: ${selectedSize}) to Bag`);
      };
    }

    if (wishlistBtn) {
      const updateWishlistUI = () => {
        const activeProd = currentProduct || product;
        const isWishlisted = store.isInWishlist(activeProd.id);
        const icon = wishlistBtn.querySelector('i');
        if (icon) {
          if (isWishlisted) {
            icon.classList.add('fill-[#121212]', 'text-[#121212]');
          } else {
            icon.classList.remove('fill-[#121212]', 'text-[#121212]');
          }
        }
        if (wishlistLabel) {
          wishlistLabel.textContent = isWishlisted ? 'Saved in Curation' : 'Save to Curation';
        }
      };

      updateWishlistUI();

      wishlistBtn.onclick = (e) => {
        if (e) e.preventDefault();
        const activeProd = currentProduct || product;
        const added = store.toggleWishlist(activeProd);
        updateWishlistUI();
        if (added) {
          toast.success(`Saved "${activeProd.name}" to Atelier Curation`);
        } else {
          toast.show(`Removed from Curation`);
        }
      };
    }
  }

  // Pincode Delivery Estimator
  function setupPincodeChecker() {
    const form = document.getElementById('pincode-form');
    const input = document.getElementById('pincode-input');
    const resultBox = document.getElementById('pincode-result');
    const estimateText = document.getElementById('pincode-estimate-text');

    if (!form || !input) return;

    form.onsubmit = (e) => {
      e.preventDefault();
      const code = input.value.trim();

      if (!/^\d{6}$/.test(code)) {
        toast.show('Please enter a valid 6-digit Indian postal code');
        if (resultBox) resultBox.classList.add('hidden');
        return;
      }

      // Calculate dynamic estimated date (today + 3 days)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const options = { weekday: 'long', day: 'numeric', month: 'short' };
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', options);

      if (estimateText) {
        estimateText.textContent = `Estimated Delivery by ${formattedDate} to Pin ${code}`;
      }
      if (resultBox) {
        resultBox.classList.remove('hidden');
      }
    };
  }

  // Similar Products Rail
  function renderSimilarProducts(currentProd) {
    const similarGrid = document.getElementById('similar-products-grid');
    if (!similarGrid) return;

    const others = allProducts.filter((p) => p.id !== currentProd.id).slice(0, 4);
    similarGrid.innerHTML = others.map(createProductCard).join('');
    bindProductCardEvents(similarGrid, others);
  }

  // Product-to-Product Touch Swipe Handler
  function initProductToProductSwipe() {
    const swipeZone = document.getElementById('pdp-buy-box');
    if (!swipeZone) return;

    let touchStartX = 0;
    let touchStartY = 0;

    swipeZone.addEventListener('touchstart', (e) => {
      if (isPhotoSwipeOpen) return;
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    swipeZone.addEventListener('touchend', (e) => {
      if (isPhotoSwipeOpen) return;
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Deliberate horizontal swipe threshold (60px) and angle check
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        const currentIndex = allProducts.findIndex((p) => p.id === currentProductId);
        if (diffX < 0 && currentIndex < allProducts.length - 1) {
          // Swipe left -> Next Product
          loadProduct(allProducts[currentIndex + 1].id);
        } else if (diffX > 0 && currentIndex > 0) {
          // Swipe right -> Prev Product
          loadProduct(allProducts[currentIndex - 1].id);
        }
      }
    }, { passive: true });
  }

  // Global document fallback delegation for size selection
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.size-pill');
    if (!pill) return;

    const size = pill.dataset.size || pill.textContent.trim();
    if (!size) return;

    selectedSize = size;

    const container = document.getElementById('size-selector') || pill.parentElement;
    if (container) {
      container.querySelectorAll('.size-pill').forEach((b) => {
        const bSize = b.dataset.size || b.textContent.trim();
        const active = bSize === size;
        b.setAttribute('aria-checked', active ? 'true' : 'false');
        if (active) {
          b.className = 'size-pill min-w-[54px] h-11 px-4 text-xs font-bold border transition-all cursor-pointer flex items-center justify-center border-[#121212] bg-[#121212] text-white shadow-xs';
        } else {
          b.className = 'size-pill min-w-[54px] h-11 px-4 text-xs font-bold border transition-all cursor-pointer flex items-center justify-center border-[#eae8e3] text-[#121212] bg-white hover:border-[#121212]';
        }
      });
    }

    const warning = document.getElementById('size-warning');
    if (warning) warning.classList.add('hidden');
  });
}

// Reliable Initialization for Deferred Modules
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPDP);
} else {
  initPDP();
}
