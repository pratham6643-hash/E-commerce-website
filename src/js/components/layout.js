import { store } from '../services/store.js';
import { productService } from '../services/products.js';
import { initSmoothScroll } from '../utils/motion.js';
import { toast } from './toast.js';
import {
  createIcons,
  ShoppingBag,
  Heart,
  Search,
  User,
  Star,
  Trash2,
  X,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Home,
  LayoutGrid
} from 'lucide';

const icons = {
  ShoppingBag,
  Heart,
  Search,
  User,
  Star,
  Trash2,
  X,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Home,
  LayoutGrid
};

export function initLayout(activePage = '') {
  renderHeader(activePage);
  renderMobileBottomNav(activePage);
  renderFooter();
  updateBadgeCounts();

  // Initialize search suggestions & mobile menu interactions
  bindHeaderInteractions();
  bindFooterInteractions();

  // Initialize unified smooth scrolling across pages (respects reduced-motion)
  initSmoothScroll();

  window.addEventListener('app:state-changed', (e) => {
    updateBadgeCounts(e.detail.cartCount, e.detail.wishlistCount);
  });

  createIcons({ icons });
}

function updateBadgeCounts(cCount = store.getCartCount(), wCount = store.getWishlistCount()) {
  const cartBadges = document.querySelectorAll('.cart-badge');
  const wishlistBadges = document.querySelectorAll('.wishlist-badge');

  cartBadges.forEach((el) => {
    el.textContent = cCount;
    el.classList.toggle('hidden', cCount === 0);
  });

  wishlistBadges.forEach((el) => {
    el.textContent = wCount;
    el.classList.toggle('hidden', wCount === 0);
  });
}

function renderHeader(activePage) {
  const container = document.getElementById('app-header');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get('category') || '';
  const currentSort = urlParams.get('sort') || '';

  container.innerHTML = `
    <!-- Top Editorial Privilege Ticker -->
    <div class="bg-[#121212] text-[#faf9f6] text-[11px] py-2 px-4 tracking-[0.16em] uppercase text-center font-normal border-b border-black/10 flex items-center justify-center gap-2">
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#c25e40]"></span>
      <span>Complimentary shipping on orders above ₹1,999 &bull; Privilege Code: <strong>ATELIER2026</strong></span>
    </div>

    <!-- Main Navigation Bar -->
    <header class="bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#eae8e3] sticky top-0 z-40 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 gap-4 lg:gap-8">
          
          <!-- Brand Wordmark & Department Links -->
          <div class="flex items-center gap-8 xl:gap-12">
            <a href="/index.html" class="flex flex-col group shrink-0" aria-label="AURELIA Atelier Home">
              <span class="font-editorial text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-[#121212] leading-none">
                AURELIA
              </span>
              <span class="text-[9px] font-sans tracking-[0.35em] text-[#525252] uppercase mt-0.5 font-medium">
                Atelier &bull; Edition
              </span>
            </a>

            <!-- Department Navigation Tabs -->
            <nav class="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs tracking-[0.14em] uppercase font-semibold">
              <a 
                href="/shop.html?category=men" 
                class="py-2 transition-colors relative ${currentCategory === 'men' ? 'text-[#121212] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#121212]' : 'text-[#525252] hover:text-[#121212]'}"
              >
                Men
              </a>
              <a 
                href="/shop.html?category=women" 
                class="py-2 transition-colors relative ${currentCategory === 'women' ? 'text-[#121212] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#121212]' : 'text-[#525252] hover:text-[#121212]'}"
              >
                Women
              </a>
              <a 
                href="/shop.html?category=footwear" 
                class="py-2 transition-colors relative ${currentCategory === 'footwear' ? 'text-[#121212] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#121212]' : 'text-[#525252] hover:text-[#121212]'}"
              >
                Footwear
              </a>
              <a 
                href="/shop.html?category=accessories" 
                class="py-2 transition-colors relative ${currentCategory === 'accessories' ? 'text-[#121212] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#121212]' : 'text-[#525252] hover:text-[#121212]'}"
              >
                Accessories
              </a>
              <a 
                href="/shop.html" 
                class="py-2 transition-colors relative ${activePage === 'shop' && !currentCategory ? 'text-[#121212] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#121212]' : 'text-[#525252] hover:text-[#121212]'}"
              >
                Studio Edit
              </a>
            </nav>
          </div>

          <!-- Central Search Bar with Live Suggestions -->
          <div class="flex-1 max-w-md hidden md:block relative">
            <form action="/shop.html" method="GET" id="header-search-form" class="relative flex items-center">
              <i data-lucide="search" class="w-4 h-4 text-[#737373] absolute left-3.5 pointer-events-none"></i>
              <input 
                type="text" 
                name="q" 
                id="header-search-input"
                autocomplete="off"
                placeholder="Search for products, brands and more" 
                class="w-full text-xs bg-white/90 border border-[#eae8e3] rounded-full py-2.5 pl-10 pr-9 text-[#121212] placeholder-[#a3a3a3] focus:outline-none focus:border-[#121212] focus:bg-white transition shadow-2xs"
              />
              <button 
                type="button" 
                id="header-search-clear" 
                class="hidden absolute right-3 text-[#a3a3a3] hover:text-[#121212] p-0.5 cursor-pointer"
                title="Clear query"
              >
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
              </button>
            </form>

            <!-- Search Suggestions Dropdown -->
            <div 
              id="header-search-suggestions" 
              class="hidden absolute top-full left-0 right-0 mt-2 bg-white border border-[#eae8e3] shadow-lg rounded-none z-50 overflow-hidden"
            >
              <!-- Dynamically populated via JS -->
            </div>
          </div>

          <!-- User Actions (Stacked Icon + Micro-Label) -->
          <div class="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
            
            <!-- Mobile Search Trigger -->
            <a href="/shop.html" class="md:hidden p-2 text-[#262626] hover:text-[#121212]" title="Search">
              <i data-lucide="search" class="w-5 h-5"></i>
            </a>

            <!-- Profile Dropdown Container -->
            <div class="relative group" id="profile-menu-container">
              <button 
                type="button" 
                id="profile-btn" 
                class="flex flex-col items-center justify-center p-1.5 text-[#262626] hover:text-[#121212] transition cursor-pointer"
                aria-expanded="false" 
                aria-haspopup="true"
              >
                <i data-lucide="user" class="w-4 h-4 sm:w-4.5 sm:h-4.5"></i>
                <span class="text-[9px] font-semibold tracking-wider uppercase mt-1 text-[#525252]">Profile</span>
              </button>

              <!-- Profile Flyout Menu -->
              <div 
                id="profile-dropdown"
                class="hidden group-hover:block hover:block absolute right-0 top-full pt-2 w-64 z-50 transition-all duration-200"
              >
                <div class="bg-white border border-[#eae8e3] shadow-xl p-5 space-y-4">
                  <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wider text-[#121212]">Welcome to AURELIA</h3>
                    <p class="text-[11px] text-[#737373] mt-0.5">Access your curated bag and saved archive.</p>
                  </div>

                  <div class="flex gap-2 pt-1 border-t border-[#eae8e3]">
                    <a href="/login.html" class="flex-1 bg-[#121212] text-white text-[11px] font-semibold tracking-wider uppercase py-2 text-center hover:bg-black transition">
                      Sign In
                    </a>
                    <a href="/signup.html" class="flex-1 border border-[#eae8e3] text-[#121212] text-[11px] font-semibold tracking-wider uppercase py-2 text-center hover:border-[#121212] transition">
                      Register
                    </a>
                  </div>

                  <ul class="pt-2 border-t border-[#eae8e3] space-y-2 text-xs">
                    <li>
                      <a href="/wishlist.html" class="flex items-center justify-between text-[#525252] hover:text-[#121212] py-1 transition">
                        <span>Saved Curation</span>
                        <span class="wishlist-badge text-[10px] font-bold bg-[#faf9f6] border border-[#eae8e3] px-1.5 py-0.5 rounded-full">0</span>
                      </a>
                    </li>
                    <li>
                      <a href="/cart.html" class="flex items-center justify-between text-[#525252] hover:text-[#121212] py-1 transition">
                        <span>Shopping Bag</span>
                        <span class="cart-badge text-[10px] font-bold bg-[#faf9f6] border border-[#eae8e3] px-1.5 py-0.5 rounded-full">0</span>
                      </a>
                    </li>
                    <li>
                      <a href="/checkout.html" class="block text-[#525252] hover:text-[#121212] py-1 transition">
                        Order Settlement
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Wishlist Action -->
            <a 
              href="/wishlist.html" 
              class="flex flex-col items-center justify-center p-1.5 text-[#262626] hover:text-[#121212] relative transition group" 
              title="Saved Items"
            >
              <div class="relative">
                <i data-lucide="heart" class="w-4 h-4 sm:w-4.5 sm:h-4.5"></i>
                <span class="wishlist-badge hidden absolute -top-1.5 -right-2 bg-[#121212] text-[#faf9f6] text-[9px] font-sans font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">0</span>
              </div>
              <span class="text-[9px] font-semibold tracking-wider uppercase mt-1 text-[#525252]">Wishlist</span>
            </a>

            <!-- Bag Action -->
            <a 
              href="/cart.html" 
              class="flex flex-col items-center justify-center p-1.5 text-[#262626] hover:text-[#121212] relative transition group" 
              title="Shopping Bag"
            >
              <div class="relative">
                <i data-lucide="shopping-bag" class="w-4 h-4 sm:w-4.5 sm:h-4.5"></i>
                <span class="cart-badge hidden absolute -top-1.5 -right-2 bg-[#121212] text-[#faf9f6] text-[9px] font-sans font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">0</span>
              </div>
              <span class="text-[9px] font-semibold tracking-wider uppercase mt-1 text-[#525252]">Bag</span>
            </a>

          </div>

        </div>
      </div>

      <!-- Category Discovery Strip (Desktop & Mobile) -->
      <div class="border-t border-[#eae8e3] bg-white/70 overflow-x-auto no-scrollbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center space-x-6 sm:space-x-8 text-[11px] uppercase tracking-wider font-semibold">
          <a href="/shop.html" class="whitespace-nowrap transition-colors ${!currentCategory && !currentSort ? 'text-[#121212] font-bold border-b border-[#121212] pb-0.5' : 'text-[#737373] hover:text-[#121212]'}">
            All Pieces
          </a>
          <a href="/shop.html?category=men" class="whitespace-nowrap transition-colors ${currentCategory === 'men' ? 'text-[#121212] font-bold border-b border-[#121212] pb-0.5' : 'text-[#737373] hover:text-[#121212]'}">
            Men
          </a>
          <a href="/shop.html?category=women" class="whitespace-nowrap transition-colors ${currentCategory === 'women' ? 'text-[#121212] font-bold border-b border-[#121212] pb-0.5' : 'text-[#737373] hover:text-[#121212]'}">
            Women
          </a>
          <a href="/shop.html?category=footwear" class="whitespace-nowrap transition-colors ${currentCategory === 'footwear' ? 'text-[#121212] font-bold border-b border-[#121212] pb-0.5' : 'text-[#737373] hover:text-[#121212]'}">
            Footwear
          </a>
          <a href="/shop.html?category=accessories" class="whitespace-nowrap transition-colors ${currentCategory === 'accessories' ? 'text-[#121212] font-bold border-b border-[#121212] pb-0.5' : 'text-[#737373] hover:text-[#121212]'}">
            Accessories
          </a>
          <a href="/shop.html?sort=newest" class="whitespace-nowrap transition-colors text-[#c25e40] hover:text-[#121212] flex items-center gap-1">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#c25e40]"></span>
            <span>New In</span>
          </a>
        </div>
      </div>
    </header>
  `;
}

function renderMobileBottomNav(activePage) {
  // Check if mobile bottom nav container exists or create it
  let nav = document.getElementById('mobile-bottom-nav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'mobile-bottom-nav';
    nav.className = 'md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae8e3] h-14 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.04)]';
    document.body.appendChild(nav);
  }

  // Ensure body has bottom padding on mobile so content is not obscured
  document.body.classList.add('pb-16', 'md:pb-0');

  nav.innerHTML = `
    <a href="/index.html" class="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition ${activePage === 'home' ? 'text-[#121212]' : 'text-[#737373] hover:text-[#121212]'}">
      <i data-lucide="home" class="w-4.5 h-4.5"></i>
      <span class="text-[9px] font-medium tracking-wider uppercase mt-1">Home</span>
    </a>

    <a href="/shop.html" class="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition ${activePage === 'shop' ? 'text-[#121212]' : 'text-[#737373] hover:text-[#121212]'}">
      <i data-lucide="layout-grid" class="w-4.5 h-4.5"></i>
      <span class="text-[9px] font-medium tracking-wider uppercase mt-1">Explore</span>
    </a>

    <a href="/wishlist.html" class="flex flex-col items-center justify-center flex-1 h-full py-1 text-center relative transition ${activePage === 'wishlist' ? 'text-[#121212]' : 'text-[#737373] hover:text-[#121212]'}">
      <div class="relative">
        <i data-lucide="heart" class="w-4.5 h-4.5"></i>
        <span class="wishlist-badge hidden absolute -top-1.5 -right-2.5 bg-[#121212] text-white text-[8px] font-bold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center">0</span>
      </div>
      <span class="text-[9px] font-medium tracking-wider uppercase mt-1">Wishlist</span>
    </a>

    <a href="/cart.html" class="flex flex-col items-center justify-center flex-1 h-full py-1 text-center relative transition ${activePage === 'cart' ? 'text-[#121212]' : 'text-[#737373] hover:text-[#121212]'}">
      <div class="relative">
        <i data-lucide="shopping-bag" class="w-4.5 h-4.5"></i>
        <span class="cart-badge hidden absolute -top-1.5 -right-2.5 bg-[#121212] text-white text-[8px] font-bold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center">0</span>
      </div>
      <span class="text-[9px] font-medium tracking-wider uppercase mt-1">Bag</span>
    </a>

    <a href="/login.html" class="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition ${activePage === 'login' || activePage === 'signup' ? 'text-[#121212]' : 'text-[#737373] hover:text-[#121212]'}">
      <i data-lucide="user" class="w-4.5 h-4.5"></i>
      <span class="text-[9px] font-medium tracking-wider uppercase mt-1">Profile</span>
    </a>
  `;
}

function bindHeaderInteractions() {
  const searchInput = document.getElementById('header-search-input');
  const clearBtn = document.getElementById('header-search-clear');
  const suggestionsBox = document.getElementById('header-search-suggestions');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
        profileDropdown.classList.add('hidden');
      }
    });
  }

  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.classList.toggle('hidden', q.length === 0);
      }

      if (q.length < 2) {
        suggestionsBox.classList.add('hidden');
        suggestionsBox.innerHTML = '';
        return;
      }

      const allProducts = productService.getAll();
      const matches = allProducts.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q))
      ).slice(0, 5);

      if (matches.length === 0) {
        suggestionsBox.innerHTML = `
          <div class="p-4 text-xs text-[#737373]">
            No pieces matching &ldquo;<span class="text-[#121212] font-medium">${q}</span>&rdquo; found.
          </div>
        `;
      } else {
        suggestionsBox.innerHTML = `
          <div class="p-2 border-b border-[#eae8e3] text-[10px] uppercase tracking-wider text-[#737373] font-medium flex justify-between">
            <span>Product Suggestions</span>
            <span>${matches.length} Matches</span>
          </div>
          <div class="divide-y divide-[#eae8e3]">
            ${matches.map((p) => `
              <a href="/product.html?id=${p.id}" class="flex items-center gap-3 p-3 hover:bg-[#faf9f6] transition group">
                <img src="${p.images[0]}" alt="${p.name}" class="w-10 h-12 object-cover bg-[#f5f4ef]" />
                <div class="flex-1 min-w-0">
                  <span class="text-[9px] uppercase tracking-widest text-[#737373] block">${p.brand}</span>
                  <span class="text-xs font-medium text-[#121212] group-hover:text-[#525252] truncate block">${p.name}</span>
                  <span class="text-xs text-[#121212] font-semibold mt-0.5 block">₹${p.price.toLocaleString('en-IN')}</span>
                </div>
              </a>
            `).join('')}
          </div>
          <a href="/shop.html?q=${encodeURIComponent(q)}" class="block p-2.5 bg-[#faf9f6] text-center text-xs font-semibold text-[#121212] hover:bg-[#eae8e3] transition uppercase tracking-wider">
            View all results for &ldquo;${q}&rdquo; &rarr;
          </a>
        `;
      }

      suggestionsBox.classList.remove('hidden');
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        suggestionsBox.classList.add('hidden');
        suggestionsBox.innerHTML = '';
        searchInput.focus();
      });
    }

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.add('hidden');
      }
    });
  }
}

function bindFooterInteractions() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input ? input.value.trim() : '';
      if (!email || !email.includes('@')) {
        toast.show('Please enter a valid email address');
        return;
      }
      if (input) input.value = '';
      toast.success('Thank you for subscribing to The Atelier Letter (Demo).');
    });
  }
}

function renderFooter() {
  const container = document.getElementById('app-footer');
  if (!container) return;

  container.innerHTML = `
    <!-- Restrained E-Commerce Trust & Assurance Strip -->
    <section class="bg-white border-t border-b border-[#eae8e3] py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          <div class="flex items-center justify-center md:justify-start gap-4 p-2">
            <div class="w-10 h-10 rounded-full bg-[#faf9f6] border border-[#eae8e3] flex items-center justify-center shrink-0">
              <i data-lucide="shield-check" class="w-5 h-5 text-[#121212]"></i>
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-[#121212]">100% Original Studio Garments</h4>
              <p class="text-[11px] text-[#737373] mt-0.5">Bespoke construction using traceable natural fibers.</p>
            </div>
          </div>

          <div class="flex items-center justify-center md:justify-start gap-4 p-2 border-t md:border-t-0 md:border-l border-[#eae8e3] pt-4 md:pt-0 md:pl-6">
            <div class="w-10 h-10 rounded-full bg-[#faf9f6] border border-[#eae8e3] flex items-center justify-center shrink-0">
              <i data-lucide="rotate-ccw" class="w-5 h-5 text-[#121212]"></i>
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-[#121212]">14-Day Free Returns & Exchanges</h4>
              <p class="text-[11px] text-[#737373] mt-0.5">Hassle-free return pickup from your doorstep.</p>
            </div>
          </div>

          <div class="flex items-center justify-center md:justify-start gap-4 p-2 border-t md:border-t-0 md:border-l border-[#eae8e3] pt-4 md:pt-0 md:pl-6">
            <div class="w-10 h-10 rounded-full bg-[#faf9f6] border border-[#eae8e3] flex items-center justify-center shrink-0">
              <i data-lucide="truck" class="w-5 h-5 text-[#121212]"></i>
            </div>
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-[#121212]">Express Carbon-Neutral Delivery</h4>
              <p class="text-[11px] text-[#737373] mt-0.5">Complimentary express dispatch on orders above ₹1,999.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Main Footer -->
    <footer class="bg-[#121212] text-[#a3a3a3] pt-16 pb-12 text-xs font-sans border-t border-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14 pb-14 border-b border-white/10">
          
          <!-- Column 1: Brand statement -->
          <div class="md:col-span-4 space-y-4">
            <span class="font-editorial text-2xl font-normal tracking-[-0.03em] text-[#faf9f6] block">AURELIA</span>
            <p class="text-xs leading-relaxed text-[#737373] max-w-sm">
              An independent fashion house dedicated to tactile natural fabrics, architectural silhouettes, and contemporary tailoring. Designed to endure across seasons.
            </p>
            <div class="pt-2 text-[11px] text-[#faf9f6] tracking-widest uppercase">
              <span>Bengaluru &bull; Milan &bull; Tokyo</span>
            </div>
          </div>

          <!-- Column 2: Department -->
          <div class="md:col-span-2 space-y-3">
            <h4 class="text-[10px] font-semibold tracking-[0.2em] text-[#faf9f6] uppercase">Departments</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/shop.html?category=men" class="hover:text-white transition">Men’s Wardrobe</a></li>
              <li><a href="/shop.html?category=women" class="hover:text-white transition">Women’s Atelier</a></li>
              <li><a href="/shop.html?category=footwear" class="hover:text-white transition">Artisanal Shoes</a></li>
              <li><a href="/shop.html?category=accessories" class="hover:text-white transition">Leather Objects</a></li>
              <li><a href="/shop.html" class="hover:text-white transition">Studio Edit</a></li>
            </ul>
          </div>

          <!-- Column 3: Customer Care & Atelier Service -->
          <div class="md:col-span-2 space-y-3">
            <h4 class="text-[10px] font-semibold tracking-[0.2em] text-[#faf9f6] uppercase">Customer Care</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/cart.html" class="hover:text-white transition">Your Bag</a></li>
              <li><a href="/wishlist.html" class="hover:text-white transition">Saved Curation</a></li>
              <li><a href="/checkout.html" class="hover:text-white transition">Checkout & Settlement</a></li>
              <li><span class="text-[#737373]">Track Order (Demo)</span></li>
              <li><span class="text-[#737373]">14-Day Exchanges</span></li>
            </ul>
          </div>

          <!-- Column 4: Newsletter -->
          <div class="md:col-span-4 space-y-3">
            <h4 class="text-[10px] font-semibold tracking-[0.2em] text-[#faf9f6] uppercase">The Atelier Letter</h4>
            <p class="text-xs text-[#737373]">Private invitations to seasonal collection releases, private sales, and styling essays.</p>
            <form id="newsletter-form" class="flex gap-2 pt-2">
              <input 
                type="email" 
                id="newsletter-email"
                required
                autocomplete="email"
                placeholder="Enter email address" 
                class="bg-white/5 border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-none flex-1 focus:outline-none focus:border-white/40"
              />
              <button type="submit" class="bg-[#faf9f6] text-[#121212] px-5 py-2.5 text-[11px] font-semibold tracking-wider uppercase hover:bg-white transition cursor-pointer">
                Join
              </button>
            </form>
          </div>

        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#525252]">
          <p>&copy; 2026 AURELIA Atelier. Independent Fashion Studio.</p>
          <div class="flex gap-6 tracking-widest uppercase text-[10px]">
            <span>Privacy Policy</span>
            <span>Terms of Order</span>
            <span>Sustainability Code</span>
          </div>
        </div>

      </div>
    </footer>
  `;
}
