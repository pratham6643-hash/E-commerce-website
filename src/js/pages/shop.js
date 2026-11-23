import { initLayout } from '../components/layout.js';
import { productService } from '../services/products.js';
import { createProductCard, bindProductCardEvents } from '../components/product-card.js';
import { formatCurrency, debounce } from '../utils/helpers.js';
import { createIcons, Filter, ArrowRight, X, Star } from 'lucide';

const icons = { Filter, ArrowRight, X, Star };

document.addEventListener('DOMContentLoaded', () => {
  initLayout('shop');

  // Read URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || '';
  const initialQuery = urlParams.get('q') || '';
  const initialSort = urlParams.get('sort') || 'recommended';

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const resultsCount = document.getElementById('results-count');
  const breadcrumbCategory = document.getElementById('breadcrumb-category');
  const sortSelect = document.getElementById('sort-select');
  const activeFiltersBar = document.getElementById('active-filters-bar');
  const activeChipsContainer = document.getElementById('active-chips-container');
  const clearAllChipsBtn = document.getElementById('clear-all-chips');
  const sidebarClearAllBtn = document.getElementById('sidebar-clear-all');

  // Search input
  const searchInput = document.getElementById('shop-search');
  const searchClearBtn = document.getElementById('shop-search-clear');

  // Filter inputs
  const categoryCheckboxes = document.querySelectorAll('.filter-category-cb');
  const brandCheckboxes = document.querySelectorAll('.filter-brand-cb');
  const sizeCheckboxes = document.querySelectorAll('.filter-size-cb');
  const priceRange = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  const priceBucketCheckboxes = document.querySelectorAll('.filter-price-cb');
  const discountRadios = document.querySelectorAll('.filter-discount-rb');
  const ratingRadios = document.querySelectorAll('.filter-rating-rb');

  // Mobile drawer elements
  const mobileSortBtn = document.getElementById('mobile-sort-btn');
  const mobileFilterBtn = document.getElementById('mobile-filter-btn');
  const mobileFilterDrawer = document.getElementById('mobile-filter-drawer');
  const closeFilterDrawer = document.getElementById('close-filter-drawer');
  const filterDrawerBackdrop = document.getElementById('filter-drawer-backdrop');
  const mobileApplyFilters = document.getElementById('mobile-apply-filters');
  const mobileClearAll = document.getElementById('mobile-clear-all');
  const mobileFilterBadge = document.getElementById('mobile-filter-badge');
  const mobileFilterControls = document.getElementById('mobile-filter-controls');

  // Mobile sort sheet
  const mobileSortSheet = document.getElementById('mobile-sort-sheet');
  const closeSortSheet = document.getElementById('close-sort-sheet');
  const sortSheetBackdrop = document.getElementById('sort-sheet-backdrop');
  const mobileSortRadios = document.querySelectorAll('input[name="mobileSort"]');

  // Filter State
  const filterState = {
    categories: initialCategory ? [initialCategory.toLowerCase()] : [],
    brands: [],
    sizes: [],
    priceBuckets: [],
    maxPrice: 6000,
    minDiscount: 0,
    minRating: 0,
    sort: initialSort,
    query: initialQuery,
  };

  // Populate dynamic category and facet counts
  function updateFacetCounts() {
    const counts = productService.getCounts();

    // Categories
    const catMen = document.getElementById('count-cat-men');
    const catWomen = document.getElementById('count-cat-women');
    const catFootwear = document.getElementById('count-cat-footwear');
    const catAccessories = document.getElementById('count-cat-accessories');
    if (catMen) catMen.textContent = `(${counts.categories['men'] || 0})`;
    if (catWomen) catWomen.textContent = `(${counts.categories['women'] || 0})`;
    if (catFootwear) catFootwear.textContent = `(${counts.categories['footwear'] || 0})`;
    if (catAccessories) catAccessories.textContent = `(${counts.categories['accessories'] || 0})`;

    // Brands
    const bAurelia = document.getElementById('count-brand-aurelia');
    const bMonolith = document.getElementById('count-brand-monolith');
    const bKairo = document.getElementById('count-brand-kairo');
    const bVellum = document.getElementById('count-brand-vellum');
    const bEpure = document.getElementById('count-brand-epure');
    if (bAurelia) bAurelia.textContent = `(${counts.brands['AURELIA ATELIER'] || 0})`;
    if (bMonolith) bMonolith.textContent = `(${counts.brands['STUDIO MONOLITH'] || 0})`;
    if (bKairo) bKairo.textContent = `(${counts.brands['KAIRO FORM'] || 0})`;
    if (bVellum) bVellum.textContent = `(${counts.brands['VELLUM & CO.'] || 0})`;
    if (bEpure) bEpure.textContent = `(${counts.brands['ATELIER ÉPURE'] || 0})`;

    // Price buckets
    const pUnder2500 = document.getElementById('count-price-under-2500');
    const p2500to3500 = document.getElementById('count-price-2500-3500');
    const pAbove3500 = document.getElementById('count-price-above-3500');
    if (pUnder2500) pUnder2500.textContent = `(${counts.priceBuckets['under-2500'] || 0})`;
    if (p2500to3500) p2500to3500.textContent = `(${counts.priceBuckets['2500-3500'] || 0})`;
    if (pAbove3500) pAbove3500.textContent = `(${counts.priceBuckets['above-3500'] || 0})`;

    // Discounts
    const d40 = document.getElementById('count-disc-40');
    const d30 = document.getElementById('count-disc-30');
    if (d40) d40.textContent = `(${counts.discounts[40] || 0})`;
    if (d30) d30.textContent = `(${counts.discounts[30] || 0})`;

    // Ratings
    const r45 = document.getElementById('count-rat-45');
    const r40 = document.getElementById('count-rat-40');
    if (r45) r45.textContent = `(${counts.ratings[4.5] || 0})`;
    if (r40) r40.textContent = `(${counts.ratings[4.0] || 0})`;
  }

  // Sync inputs with state
  function syncInputsWithState() {
    // Categories
    categoryCheckboxes.forEach((cb) => {
      cb.checked = filterState.categories.includes(cb.value.toLowerCase());
    });

    // Brands
    brandCheckboxes.forEach((cb) => {
      cb.checked = filterState.brands.includes(cb.value);
    });

    // Sizes
    sizeCheckboxes.forEach((cb) => {
      cb.checked = filterState.sizes.includes(cb.value);
    });

    // Price range
    if (priceRange) {
      priceRange.value = filterState.maxPrice;
    }
    if (priceDisplay) {
      priceDisplay.textContent = formatCurrency(filterState.maxPrice);
    }

    // Price buckets
    priceBucketCheckboxes.forEach((cb) => {
      cb.checked = filterState.priceBuckets.includes(cb.value);
    });

    // Discount
    discountRadios.forEach((rb) => {
      rb.checked = Number(rb.value) === filterState.minDiscount;
    });

    // Rating
    ratingRadios.forEach((rb) => {
      rb.checked = Number(rb.value) === filterState.minRating;
    });

    // Search
    if (searchInput) {
      searchInput.value = filterState.query;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('hidden', !filterState.query);
      }
    }

    // Sort select
    if (sortSelect) {
      sortSelect.value = filterState.sort;
    }
    mobileSortRadios.forEach((rb) => {
      rb.checked = rb.value === filterState.sort;
    });

    // Breadcrumb
    if (breadcrumbCategory) {
      if (filterState.categories.length === 1) {
        const catName = filterState.categories[0];
        breadcrumbCategory.textContent = catName.charAt(0).toUpperCase() + catName.slice(1);
      } else if (filterState.categories.length > 1) {
        breadcrumbCategory.textContent = `${filterState.categories.length} Departments`;
      } else {
        breadcrumbCategory.textContent = 'All Pieces';
      }
    }
  }

  // Render Active Filter Chips (Permanently removed to eliminate vertical layout jumps)
  function renderActiveChips() {
    if (activeFiltersBar) {
      activeFiltersBar.remove();
    }

    // Calculate active filter count for mobile badge
    let activeFilterCount = 0;
    if (filterState.query) activeFilterCount++;
    activeFilterCount += filterState.categories.length;
    activeFilterCount += filterState.brands.length;
    activeFilterCount += filterState.sizes.length;
    activeFilterCount += filterState.priceBuckets.length;
    if (filterState.maxPrice < 6000) activeFilterCount++;
    if (filterState.minDiscount > 0) activeFilterCount++;
    if (filterState.minRating > 0) activeFilterCount++;

    if (mobileFilterBadge) {
      if (activeFilterCount > 0) {
        mobileFilterBadge.classList.remove('hidden');
      } else {
        mobileFilterBadge.classList.add('hidden');
      }
    }
  }

  // Render Filtered Products
  function renderProducts() {
    const filtered = productService.filter(filterState);

    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'Luxury Piece' : 'Luxury Pieces'}`;
    }

    if (productsGrid) {
      if (filtered.length === 0) {
        productsGrid.innerHTML = `
          <div class="col-span-full py-20 text-center text-[#737373] bg-white border border-[#eae8e3] p-8 space-y-4">
            <i data-lucide="filter" class="w-10 h-10 mx-auto text-[#a3a3a3]"></i>
            <h3 class="font-editorial text-2xl text-[#121212]">No Matching Pieces Found</h3>
            <p class="text-xs text-[#737373] max-w-sm mx-auto font-light leading-relaxed">
              We couldn't locate any pieces meeting all your selected criteria. Try removing one or more active filters.
            </p>
            <button 
              type="button" 
              id="empty-reset-filters" 
              class="inline-block bg-[#121212] text-white text-xs font-semibold uppercase tracking-wider px-6 py-2.5 hover:bg-black transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        `;

        const resetBtn = document.getElementById('empty-reset-filters');
        if (resetBtn) {
          resetBtn.addEventListener('click', resetAllFilters);
        }
      } else {
        productsGrid.innerHTML = filtered.map(createProductCard).join('');
        bindProductCardEvents(productsGrid, filtered);
      }
    }

    renderActiveChips();
    createIcons({ icons });
  }

  function resetAllFilters() {
    filterState.categories = [];
    filterState.brands = [];
    filterState.sizes = [];
    filterState.priceBuckets = [];
    filterState.maxPrice = 6000;
    filterState.minDiscount = 0;
    filterState.minRating = 0;
    filterState.query = '';
    filterState.sort = 'recommended';

    // Update URL without refresh
    const url = new URL(window.location);
    url.search = '';
    window.history.replaceState({}, '', url);

    syncInputsWithState();
    renderProducts();
  }

  // Event Listeners for Filters

  // Category Checkboxes
  categoryCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const val = cb.value.toLowerCase();
      if (cb.checked) {
        if (!filterState.categories.includes(val)) filterState.categories.push(val);
      } else {
        filterState.categories = filterState.categories.filter((c) => c !== val);
      }
      syncInputsWithState();
      renderProducts();
    });
  });

  // Brand Checkboxes
  brandCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) {
        if (!filterState.brands.includes(val)) filterState.brands.push(val);
      } else {
        filterState.brands = filterState.brands.filter((b) => b !== val);
      }
      syncInputsWithState();
      renderProducts();
    });
  });

  // Size Checkboxes
  sizeCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) {
        if (!filterState.sizes.includes(val)) filterState.sizes.push(val);
      } else {
        filterState.sizes = filterState.sizes.filter((s) => s !== val);
      }
      syncInputsWithState();
      renderProducts();
    });
  });

  // Price Range Slider
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      filterState.maxPrice = Number(e.target.value);
      if (priceDisplay) {
        priceDisplay.textContent = formatCurrency(filterState.maxPrice);
      }
    });

    priceRange.addEventListener('change', () => {
      renderProducts();
    });
  }

  // Price Bucket Checkboxes
  priceBucketCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!filterState.priceBuckets.includes(cb.value)) {
          filterState.priceBuckets.push(cb.value);
        }
      } else {
        filterState.priceBuckets = filterState.priceBuckets.filter((b) => b !== cb.value);
      }
      renderProducts();
    });
  });

  // Discount Radios
  discountRadios.forEach((rb) => {
    rb.addEventListener('change', () => {
      if (rb.checked) {
        filterState.minDiscount = Number(rb.value);
        renderProducts();
      }
    });
  });

  // Rating Radios
  ratingRadios.forEach((rb) => {
    rb.addEventListener('change', () => {
      if (rb.checked) {
        filterState.minRating = Number(rb.value);
        renderProducts();
      }
    });
  });

  // Search Input Debouncing
  if (searchInput) {
    searchInput.addEventListener(
      'input',
      debounce((e) => {
        filterState.query = e.target.value.trim();
        if (searchClearBtn) {
          searchClearBtn.classList.toggle('hidden', !filterState.query);
        }
        renderProducts();
      }, 300)
    );
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchClearBtn.classList.add('hidden');
      filterState.query = '';
      renderProducts();
    });
  }

  // Desktop Sort Select
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      filterState.sort = e.target.value;
      renderProducts();
    });
  }

  // Clear All Buttons
  if (clearAllChipsBtn) clearAllChipsBtn.addEventListener('click', resetAllFilters);
  if (sidebarClearAllBtn) sidebarClearAllBtn.addEventListener('click', resetAllFilters);

  // Mobile Drawer Controls
  function openMobileDrawer() {
    // Clone desktop controls into mobile drawer if empty
    const sidebarContent = document.querySelector('aside');
    if (sidebarContent && mobileFilterControls) {
      mobileFilterControls.innerHTML = sidebarContent.innerHTML;
      // Re-bind events in mobile drawer
      bindMobileDrawerControls();
    }
    if (mobileFilterDrawer) {
      mobileFilterDrawer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileDrawer() {
    if (mobileFilterDrawer) mobileFilterDrawer.classList.add('hidden');
    if (!mobileSortSheet || mobileSortSheet.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }

  if (mobileFilterBtn && mobileFilterDrawer) {
    mobileFilterBtn.addEventListener('click', openMobileDrawer);
  }

  if (closeFilterDrawer) closeFilterDrawer.addEventListener('click', closeMobileDrawer);
  if (filterDrawerBackdrop) filterDrawerBackdrop.addEventListener('click', closeMobileDrawer);
  if (mobileApplyFilters) {
    mobileApplyFilters.addEventListener('click', () => {
      closeMobileDrawer();
      renderProducts();
    });
  }
  if (mobileClearAll) {
    mobileClearAll.addEventListener('click', () => {
      resetAllFilters();
      closeMobileDrawer();
    });
  }

  function bindMobileDrawerControls() {
    if (!mobileFilterControls) return;

    // Mobile categories
    mobileFilterControls.querySelectorAll('.filter-category-cb').forEach((cb) => {
      cb.checked = filterState.categories.includes(cb.value.toLowerCase());
      cb.addEventListener('change', () => {
        const val = cb.value.toLowerCase();
        if (cb.checked) {
          if (!filterState.categories.includes(val)) filterState.categories.push(val);
        } else {
          filterState.categories = filterState.categories.filter((c) => c !== val);
        }
        syncInputsWithState();
      });
    });

    // Mobile brands
    mobileFilterControls.querySelectorAll('.filter-brand-cb').forEach((cb) => {
      cb.checked = filterState.brands.includes(cb.value);
      cb.addEventListener('change', () => {
        const val = cb.value;
        if (cb.checked) {
          if (!filterState.brands.includes(val)) filterState.brands.push(val);
        } else {
          filterState.brands = filterState.brands.filter((b) => b !== val);
        }
        syncInputsWithState();
      });
    });

    // Mobile sizes
    mobileFilterControls.querySelectorAll('.filter-size-cb').forEach((cb) => {
      cb.checked = filterState.sizes.includes(cb.value);
      cb.addEventListener('change', () => {
        const val = cb.value;
        if (cb.checked) {
          if (!filterState.sizes.includes(val)) filterState.sizes.push(val);
        } else {
          filterState.sizes = filterState.sizes.filter((s) => s !== val);
        }
        syncInputsWithState();
      });
    });

    // Mobile price slider
    const mSlider = mobileFilterControls.querySelector('#price-range');
    const mDisplay = mobileFilterControls.querySelector('#price-display');
    if (mSlider) {
      mSlider.value = filterState.maxPrice;
      mSlider.addEventListener('input', (e) => {
        filterState.maxPrice = Number(e.target.value);
        if (mDisplay) mDisplay.textContent = formatCurrency(filterState.maxPrice);
        if (priceDisplay) priceDisplay.textContent = formatCurrency(filterState.maxPrice);
      });
    }

    // Mobile price buckets
    mobileFilterControls.querySelectorAll('.filter-price-cb').forEach((cb) => {
      cb.checked = filterState.priceBuckets.includes(cb.value);
      cb.addEventListener('change', () => {
        if (cb.checked) {
          if (!filterState.priceBuckets.includes(cb.value)) filterState.priceBuckets.push(cb.value);
        } else {
          filterState.priceBuckets = filterState.priceBuckets.filter((b) => b !== cb.value);
        }
        syncInputsWithState();
      });
    });

    // Mobile discounts
    mobileFilterControls.querySelectorAll('.filter-discount-rb').forEach((rb) => {
      rb.checked = Number(rb.value) === filterState.minDiscount;
      rb.addEventListener('change', () => {
        if (rb.checked) {
          filterState.minDiscount = Number(rb.value);
          syncInputsWithState();
        }
      });
    });

    // Mobile ratings
    mobileFilterControls.querySelectorAll('.filter-rating-rb').forEach((rb) => {
      rb.checked = Number(rb.value) === filterState.minRating;
      rb.addEventListener('change', () => {
        if (rb.checked) {
          filterState.minRating = Number(rb.value);
          syncInputsWithState();
        }
      });
    });

    createIcons({ icons });
  }

  // Mobile Sort Sheet Controls
  function openMobileSort() {
    if (mobileSortSheet) {
      mobileSortSheet.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileSort() {
    if (mobileSortSheet) mobileSortSheet.classList.add('hidden');
    if (!mobileFilterDrawer || mobileFilterDrawer.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }

  if (mobileSortBtn && mobileSortSheet) {
    mobileSortBtn.addEventListener('click', openMobileSort);
  }

  if (closeSortSheet) closeSortSheet.addEventListener('click', closeMobileSort);
  if (sortSheetBackdrop) sortSheetBackdrop.addEventListener('click', closeMobileSort);

  // Keyboard and Window Safety
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileDrawer();
      closeMobileSort();
    }
  });

  window.addEventListener('beforeunload', () => {
    document.body.style.overflow = '';
  });

  mobileSortRadios.forEach((rb) => {
    rb.addEventListener('change', () => {
      if (rb.checked) {
        filterState.sort = rb.value;
        if (sortSelect) sortSelect.value = rb.value;
        closeMobileSort();
        renderProducts();
      }
    });
  });

  // Initial Run
  updateFacetCounts();
  syncInputsWithState();
  renderProducts();
});
