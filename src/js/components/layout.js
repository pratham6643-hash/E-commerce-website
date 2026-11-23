import { store } from '../services/store.js';
import { productService } from '../services/products.js';
import { authService } from '../services/auth.js';
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
  LayoutGrid,
  Package,
  Gift,
  HelpCircle,
  Tag,
  MapPin,
  Settings,
  LogOut,
  Edit3
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
  LayoutGrid,
  Package,
  Gift,
  HelpCircle,
  Tag,
  MapPin,
  Settings,
  LogOut,
  Edit3
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
    <!-- Top Marketplace Announcement / Privilege Ticker with Help Link -->
    <div class="bg-[#121212] text-[#ffffff] text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 tracking-[0.14em] uppercase font-medium border-b border-black/10">
      <div class="max-w-[1680px] mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 mx-auto sm:mx-0">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#c25e40]"></span>
          <span>FLAT 15% OFF ON YOUR FIRST ORDER &bull; USE CODE: <strong>ATELIER2026</strong> &bull; FREE DELIVERY OVER ₹2,500</span>
        </div>
        <div class="hidden sm:flex items-center gap-4 text-[10px] tracking-wider text-white/80 shrink-0">
          <a href="/help.html" class="hover:text-white hover:underline transition flex items-center gap-1 font-semibold">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
            <span>Need Help? Contact Us</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Main Myntra-Style Sticky Navigation Header -->
    <header class="bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#eae8e3] sticky top-0 z-50 transition-colors shadow-2xs">
      <div class="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div class="flex items-center justify-between h-20 gap-3 md:gap-4 lg:gap-8">
          
          <!-- Brand Logo & Main Category Navigation Links -->
          <div class="flex items-center gap-6 xl:gap-10 h-full">
            <a href="/index.html" class="flex flex-col group shrink-0" aria-label="AURELIA Atelier Home">
              <span class="text-2xl sm:text-[26px] font-bold tracking-[-0.03em] text-[#121212] leading-none">
                AURELIA
              </span>
              <span class="text-[9px] font-sans tracking-[0.38em] text-[#535766] uppercase mt-0.5 font-bold">
                ATELIER
              </span>
            </a>

            <!-- Category Navigation Tabs with Hover Mega Menus -->
            <nav class="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[13px] tracking-wider uppercase font-bold h-20">
              
              <!-- Men Category & Mega Menu -->
              <div class="group/nav relative h-full flex items-center">
                <a 
                  href="/shop.html?category=men" 
                  class="nav-category-link ${currentCategory === 'men' ? 'active' : ''}"
                >
                  Men
                </a>
                <!-- Men Multi-Column Mega Menu -->
                <div class="hidden group-hover/nav:grid absolute top-full left-0 w-[720px] xl:w-[780px] max-w-[calc(100vw-2rem)] bg-white border border-[#eaeaec] shadow-2xl p-6 xl:p-7 grid-cols-4 gap-5 xl:gap-6 z-50 text-left normal-case tracking-normal rounded-b-xs">
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c25e40] mb-3 pb-1 border-b border-gray-100">Topwear</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?category=men&q=linen" class="hover:text-[#121212] hover:font-semibold transition">Linen Shirts</a></li>
                      <li><a href="/shop.html?category=men&q=shirt" class="hover:text-[#121212] hover:font-semibold transition">Casual Shirts</a></li>
                      <li><a href="/shop.html?category=men&q=twill" class="hover:text-[#121212] hover:font-semibold transition">Twill Overshirts</a></li>
                      <li><a href="/shop.html?category=men&q=jacket" class="hover:text-[#121212] hover:font-semibold transition">Jackets & Coats</a></li>
                      <li><a href="/shop.html?category=men&q=trench" class="hover:text-[#121212] hover:font-semibold transition">Trench Coats</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#121212] mb-3 pb-1 border-b border-gray-100">Bottomwear</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?category=men&q=trousers" class="hover:text-[#121212] hover:font-semibold transition">Pleated Trousers</a></li>
                      <li><a href="/shop.html?category=men&q=linen" class="hover:text-[#121212] hover:font-semibold transition">Linen Pants</a></li>
                      <li><a href="/shop.html?category=men&q=drawstring" class="hover:text-[#121212] hover:font-semibold transition">Casual Chinos</a></li>
                      <li><a href="/shop.html?category=men" class="text-[#c25e40] font-bold hover:underline block pt-2 text-[11px] uppercase tracking-wider">View All Men &rarr;</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#121212] mb-3 pb-1 border-b border-gray-100">Top Brands</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?brand=STUDIO%20MONOLITH" class="hover:text-[#121212] hover:font-semibold transition">Studio Monolith</a></li>
                      <li><a href="/shop.html?brand=AURELIA%20ATELIER" class="hover:text-[#121212] hover:font-semibold transition">Aurelia Atelier</a></li>
                      <li><a href="/shop.html?brand=KAIRO%20FORM" class="hover:text-[#121212] hover:font-semibold transition">Kairo Form</a></li>
                      <li><a href="/shop.html?brand=ATELIER%20%C3%89PURE" class="hover:text-[#121212] hover:font-semibold transition">Atelier Épure</a></li>
                    </ul>
                  </div>
                  <div class="bg-[#fdfbf9] p-4 border border-[#f0ece5] flex flex-col justify-between rounded-xs">
                    <div>
                      <span class="text-[9px] uppercase tracking-wider font-bold text-[#c25e40] block mb-1">Trending Now</span>
                      <h5 class="text-sm font-bold text-[#121212]">New in Men</h5>
                      <p class="text-[11px] text-[#737373] mt-1 font-normal leading-relaxed">Relaxed fits in pure breathable fabrics.</p>
                    </div>
                    <a href="/shop.html?category=men" class="text-[10px] uppercase font-bold tracking-wider text-[#121212] hover:text-[#c25e40] underline mt-3">Shop Now &rarr;</a>
                  </div>
                </div>
              </div>

              <!-- Women Category & Mega Menu -->
              <div class="group/nav relative h-full flex items-center">
                <a 
                  href="/shop.html?category=women" 
                  class="nav-category-link ${currentCategory === 'women' ? 'active' : ''}"
                >
                  Women
                </a>
                <!-- Women Multi-Column Mega Menu -->
                <div class="hidden group-hover/nav:grid absolute top-full -left-12 xl:-left-20 w-[720px] xl:w-[780px] max-w-[calc(100vw-2rem)] bg-white border border-[#eaeaec] shadow-2xl p-6 xl:p-7 grid-cols-4 gap-5 xl:gap-6 z-50 text-left normal-case tracking-normal rounded-b-xs">
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c25e40] mb-3 pb-1 border-b border-gray-100">Dresses & Outerwear</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?category=women&q=dress" class="hover:text-[#121212] hover:font-semibold transition">Slip Dresses</a></li>
                      <li><a href="/shop.html?category=women&q=trench" class="hover:text-[#121212] hover:font-semibold transition">Trench Coats</a></li>
                      <li><a href="/shop.html?category=women&q=kimono" class="hover:text-[#121212] hover:font-semibold transition">Wrap Kimonos</a></li>
                      <li><a href="/shop.html?category=women&q=tunic" class="hover:text-[#121212] hover:font-semibold transition">Tunics & Tops</a></li>
                      <li><a href="/shop.html?category=women&q=blazer" class="hover:text-[#121212] hover:font-semibold transition">Tailored Blazers</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#121212] mb-3 pb-1 border-b border-gray-100">Trousers & Skirts</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?category=women&q=trousers" class="hover:text-[#121212] hover:font-semibold transition">Wide-Leg Trousers</a></li>
                      <li><a href="/shop.html?category=women&q=skirt" class="hover:text-[#121212] hover:font-semibold transition">Pleated Skirts</a></li>
                      <li><a href="/shop.html?category=women&q=linen" class="hover:text-[#121212] hover:font-semibold transition">Linen Sets</a></li>
                      <li><a href="/shop.html?category=women" class="text-[#c25e40] font-bold hover:underline block pt-2 text-[11px] uppercase tracking-wider">View All Women &rarr;</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#121212] mb-3 pb-1 border-b border-gray-100">Top Brands</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?brand=AURELIA%20ATELIER" class="hover:text-[#121212] hover:font-semibold transition">Aurelia Atelier</a></li>
                      <li><a href="/shop.html?brand=KAIRO%20FORM" class="hover:text-[#121212] hover:font-semibold transition">Kairo Form</a></li>
                      <li><a href="/shop.html?brand=ATELIER%20%C3%89PURE" class="hover:text-[#121212] hover:font-semibold transition">Atelier Épure</a></li>
                      <li><a href="/shop.html?sort=newest" class="hover:text-[#121212] hover:font-semibold transition">New Arrivals</a></li>
                    </ul>
                  </div>
                  <div class="bg-[#fdfbf9] p-4 border border-[#f0ece5] flex flex-col justify-between rounded-xs">
                    <div>
                      <span class="text-[9px] uppercase tracking-wider font-bold text-[#c25e40] block mb-1">Trending Now</span>
                      <h5 class="text-sm font-bold text-[#121212]">New in Women</h5>
                      <p class="text-[11px] text-[#737373] mt-1 font-normal leading-relaxed">Soft silk blends and elegant draping.</p>
                    </div>
                    <a href="/shop.html?category=women" class="text-[10px] uppercase font-bold tracking-wider text-[#121212] hover:text-[#c25e40] underline mt-3">Shop Now &rarr;</a>
                  </div>
                </div>
              </div>

              <!-- Footwear Category & Mega Menu -->
              <div class="group/nav relative h-full flex items-center">
                <a 
                  href="/shop.html?category=footwear" 
                  class="nav-category-link ${currentCategory === 'footwear' ? 'active' : ''}"
                >
                  Footwear
                </a>
                <!-- Footwear Multi-Column Mega Menu -->
                <div class="hidden group-hover/nav:grid absolute top-full -left-20 xl:-left-36 w-[620px] xl:w-[680px] max-w-[calc(100vw-2rem)] bg-white border border-[#eaeaec] shadow-2xl p-6 xl:p-7 grid-cols-3 gap-5 xl:gap-6 z-50 text-left normal-case tracking-normal rounded-b-xs">
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c25e40] mb-3 pb-1 border-b border-gray-100">Shoes & Loafers</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?category=footwear&q=loafer" class="hover:text-[#121212] hover:font-semibold transition">Leather Loafers</a></li>
                      <li><a href="/shop.html?category=footwear&q=derby" class="hover:text-[#121212] hover:font-semibold transition">Derby Shoes</a></li>
                      <li><a href="/shop.html?category=footwear&q=boot" class="hover:text-[#121212] hover:font-semibold transition">Chelsea Boots</a></li>
                      <li><a href="/shop.html?category=footwear&q=mule" class="hover:text-[#121212] hover:font-semibold transition">Suede Mules & Flats</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#121212] mb-3 pb-1 border-b border-gray-100">Quality & Comfort</h4>
                    <p class="text-xs text-[#737373] leading-relaxed">Handcrafted genuine leather footwear designed for all-day comfort and long-lasting durability.</p>
                    <a href="/shop.html?category=footwear" class="text-[#c25e40] font-bold text-[11px] uppercase tracking-wider hover:underline block pt-3">View All Footwear &rarr;</a>
                  </div>
                  <div class="bg-[#fdfbf9] p-4 border border-[#f0ece5] flex flex-col justify-between rounded-xs">
                    <div>
                      <span class="text-[9px] uppercase tracking-wider font-bold text-[#c25e40] block mb-1">Handmade</span>
                      <h5 class="text-sm font-bold text-[#121212]">Vellum & Co. Shoes</h5>
                      <p class="text-[11px] text-[#737373] mt-1 font-normal leading-relaxed">Genuine leather for long-lasting comfort.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Accessories Category & Mega Menu -->
              <div class="group/nav relative h-full flex items-center">
                <a 
                  href="/shop.html?category=accessories" 
                  class="nav-category-link ${currentCategory === 'accessories' ? 'active' : ''}"
                >
                  Accessories
                </a>
                <!-- Accessories Multi-Column Mega Menu -->
                <div class="hidden group-hover/nav:grid absolute top-full -left-28 xl:-left-52 w-[620px] xl:w-[680px] max-w-[calc(100vw-2rem)] bg-white border border-[#eaeaec] shadow-2xl p-6 xl:p-7 grid-cols-3 gap-5 xl:gap-6 z-50 text-left normal-case tracking-normal rounded-b-xs">
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c25e40] mb-3 pb-1 border-b border-gray-100">Bags & Wallets</h4>
                    <ul class="space-y-2 text-xs text-[#535766]">
                      <li><a href="/shop.html?category=accessories&q=tote" class="hover:text-[#121212] hover:font-semibold transition">Leather Handbags & Totes</a></li>
                      <li><a href="/shop.html?category=accessories&q=wallet" class="hover:text-[#121212] hover:font-semibold transition">Wallets & Card Cases</a></li>
                      <li><a href="/shop.html?category=accessories&q=belt" class="hover:text-[#121212] hover:font-semibold transition">Leather Belts</a></li>
                      <li><a href="/shop.html?category=accessories&q=scarf" class="hover:text-[#121212] hover:font-semibold transition">Silk Scarves</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#121212] mb-3 pb-1 border-b border-gray-100">Materials</h4>
                    <p class="text-xs text-[#737373] leading-relaxed">Durable genuine leather, sturdy solid metal hardware, and clean minimal finishes.</p>
                    <a href="/shop.html?category=accessories" class="text-[#c25e40] font-bold text-[11px] uppercase tracking-wider hover:underline block pt-3">View All Accessories &rarr;</a>
                  </div>
                  <div class="bg-[#fdfbf9] p-4 border border-[#f0ece5] flex flex-col justify-between rounded-xs">
                    <div>
                      <span class="text-[9px] uppercase tracking-wider font-bold text-[#c25e40] block mb-1">Everyday Essentials</span>
                      <h5 class="text-sm font-bold text-[#121212]">Wallets & Belts</h5>
                      <p class="text-[11px] text-[#737373] mt-1 font-normal leading-relaxed">Clean, functional everyday accessories.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Studio Edit (Shop All) -->
              <div class="h-full flex items-center">
                <a 
                  href="/shop.html" 
                  class="nav-category-link ${activePage === 'shop' && !currentCategory ? 'active' : ''}"
                >
                  Shop All
                </a>
              </div>

            </nav>
          </div>

          <!-- Central Wide Search Bar with Live Suggestions -->
          <div class="flex-1 max-w-xs md:max-w-sm lg:max-w-lg xl:max-w-xl hidden md:block relative">
            <form action="/shop.html" method="GET" id="header-search-form" class="relative flex items-center">
              <i data-lucide="search" class="w-4 h-4 text-[#737373] absolute left-3.5 pointer-events-none"></i>
              <input 
                type="text" 
                name="q" 
                id="header-search-input"
                autocomplete="off"
                placeholder="Search for products, brands and more" 
                class="w-full text-xs bg-[#f5f5f6] hover:bg-gray-100 border border-transparent focus:border-gray-300 focus:bg-white rounded-md py-2.5 pl-10 pr-9 text-[#121212] placeholder-[#94969f] focus:outline-none transition shadow-2xs"
              />
              <button 
                type="button" 
                id="header-search-clear" 
                class="hidden absolute right-3 text-[#a3a3a3] hover:text-[#121212] p-0.5 cursor-pointer"
                title="Clear search"
              >
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
              </button>
            </form>

            <!-- Search Suggestions Dropdown -->
            <div 
              id="header-search-suggestions" 
              class="hidden absolute top-full left-0 right-0 mt-2 bg-white border border-[#eaeaec] shadow-xl rounded-md z-50 overflow-hidden"
            >
              <!-- Dynamically populated via JS -->
            </div>
          </div>

          <!-- User Actions Cluster (Profile, Wishlist, Bag with Stacked Labels) -->
          <div class="flex items-center gap-3 sm:gap-4 lg:gap-7 shrink-0">
            
            <!-- Mobile Search Trigger Button -->
            <button 
              type="button" 
              id="mobile-search-toggle-btn" 
              class="md:hidden p-2 text-[#282c3f] hover:text-[#121212] transition cursor-pointer" 
              aria-label="Toggle search"
            >
              <i data-lucide="search" class="w-5 h-5"></i>
            </button>

            <!-- Profile Dropdown Container -->
            <div class="relative group/profile" id="profile-menu-container">
              <button 
                type="button" 
                id="profile-btn" 
                class="flex flex-col items-center justify-center p-1.5 text-[#282c3f] hover:text-[#121212] transition cursor-pointer"
                aria-expanded="false" 
                aria-haspopup="true"
                aria-label="User Account"
              >
                <i data-lucide="user" class="w-4.5 h-4.5"></i>
                <span class="text-[10px] font-bold tracking-wider uppercase mt-1 text-[#282c3f]">Profile</span>
              </button>

              <!-- Profile Dropdown Menu with zero-flicker bridge -->
              <div 
                id="profile-dropdown"
                class="hidden group-hover/profile:block absolute right-0 top-full pt-2 w-72 z-50 transition-all duration-150"
              >
                <div class="bg-white border border-[#eaeaec] shadow-2xl p-5 space-y-3.5 text-xs rounded-xs">
                  <!-- Greeting Block -->
                  <div id="profile-greeting-block">
                    <h3 id="profile-greeting-name" class="text-xs font-bold uppercase tracking-wider text-[#121212]">Hello, Customer</h3>
                    <p id="profile-greeting-subtitle" class="text-[11px] text-[#737373] mt-0.5">Welcome to AURELIA Atelier</p>
                  </div>

                  <div id="profile-auth-buttons" class="flex gap-2 pt-2 border-t border-[#eaeaec]">
                    <a href="/login.html" class="flex-1 bg-[#121212] text-white text-[11px] font-bold tracking-wider uppercase py-2 text-center hover:bg-black transition rounded-xs">
                      Log In
                    </a>
                    <a href="/signup.html" class="flex-1 border border-gray-300 text-[#121212] text-[11px] font-bold tracking-wider uppercase py-2 text-center hover:border-black transition rounded-xs">
                      Sign Up
                    </a>
                  </div>

                  <!-- 9 Account Options -->
                  <ul class="pt-2 border-t border-[#eaeaec] space-y-1 text-xs text-[#535766]">
                    <li>
                      <button type="button" class="profile-action-btn flex items-center gap-2.5 w-full text-left py-1.5 hover:text-[#121212] hover:font-bold transition cursor-pointer" data-action="profile">
                        <i data-lucide="user" class="w-3.5 h-3.5"></i>
                        <span>My Profile</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="profile-action-btn flex items-center justify-between w-full text-left py-1.5 hover:text-[#121212] hover:font-bold transition cursor-pointer" data-action="orders">
                        <span class="flex items-center gap-2.5">
                          <i data-lucide="package" class="w-3.5 h-3.5"></i>
                          <span>My Orders</span>
                        </span>
                        <span class="text-[9px] uppercase tracking-wider bg-gray-100 text-[#737373] px-1.5 py-0.5 rounded-xs font-semibold">Demo</span>
                      </button>
                    </li>
                    <li>
                      <a href="/wishlist.html" class="flex items-center justify-between py-1.5 hover:text-[#121212] hover:font-bold transition">
                        <span class="flex items-center gap-2.5">
                          <i data-lucide="heart" class="w-3.5 h-3.5"></i>
                          <span>Wishlist</span>
                        </span>
                        <span class="wishlist-badge text-[10px] font-bold bg-[#f5f5f6] border border-[#eaeaec] px-1.5 py-0.5 rounded-full">0</span>
                      </a>
                    </li>
                    <li>
                      <button type="button" class="profile-action-btn flex items-center gap-2.5 w-full text-left py-1.5 hover:text-[#121212] hover:font-bold transition cursor-pointer" data-action="giftcards">
                        <i data-lucide="gift" class="w-3.5 h-3.5"></i>
                        <span>Gift Cards</span>
                      </button>
                    </li>
                    <li>
                      <a href="/help.html" class="flex items-center gap-2.5 py-1.5 hover:text-[#121212] hover:font-bold transition">
                        <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                        <span>Contact Us</span>
                      </a>
                    </li>
                    <li>
                      <button type="button" class="profile-action-btn flex items-center justify-between w-full text-left py-1.5 hover:text-[#121212] hover:font-bold transition cursor-pointer" data-action="coupons">
                        <span class="flex items-center gap-2.5">
                          <i data-lucide="tag" class="w-3.5 h-3.5"></i>
                          <span>Coupons</span>
                        </span>
                        <span class="text-[10px] font-bold text-[#c25e40]">2 Offers</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="profile-action-btn flex items-center gap-2.5 w-full text-left py-1.5 hover:text-[#121212] hover:font-bold transition cursor-pointer" data-action="addresses">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                        <span>Saved Addresses</span>
                      </button>
                    </li>
                    <li id="profile-edit-item" class="hidden">
                      <button type="button" class="profile-action-btn flex items-center gap-2.5 w-full text-left py-1.5 hover:text-[#121212] hover:font-bold transition cursor-pointer" data-action="editprofile">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                        <span>Edit Profile</span>
                      </button>
                    </li>
                    <li id="profile-logout-item" class="pt-2 border-t border-[#eaeaec] hidden">
                      <button type="button" id="profile-logout-btn" class="flex items-center gap-2.5 w-full text-left py-1.5 text-red-600 hover:text-red-800 hover:font-bold transition cursor-pointer">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Wishlist Action -->
            <a 
              href="/wishlist.html" 
              class="flex flex-col items-center justify-center p-1.5 text-[#282c3f] hover:text-[#121212] relative transition group" 
              title="Saved Items"
            >
              <div class="relative">
                <i data-lucide="heart" class="w-4.5 h-4.5"></i>
                <span class="wishlist-badge hidden absolute -top-1.5 -right-2 bg-[#ff3f6c] text-white text-[9px] font-sans font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">0</span>
              </div>
              <span class="text-[10px] font-bold tracking-wider uppercase mt-1 text-[#282c3f]">Wishlist</span>
            </a>

            <!-- Bag Action -->
            <a 
              href="/cart.html" 
              class="flex flex-col items-center justify-center p-1.5 text-[#282c3f] hover:text-[#121212] relative transition group" 
              title="Shopping Bag"
            >
              <div class="relative">
                <i data-lucide="shopping-bag" class="w-4.5 h-4.5"></i>
                <span class="cart-badge hidden absolute -top-1.5 -right-2 bg-[#ff3f6c] text-white text-[9px] font-sans font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">0</span>
              </div>
              <span class="text-[10px] font-bold tracking-wider uppercase mt-1 text-[#282c3f]">Bag</span>
            </a>

          </div>

        </div>
      </div>

      <!-- Expandable Mobile Search Bar Container -->
      <div id="mobile-search-bar" class="hidden md:hidden px-4 pb-3 pt-1 border-t border-[#eae8e3] bg-[#F8F7F4]">
        <form action="/shop.html" method="GET" class="relative flex items-center">
          <i data-lucide="search" class="w-4 h-4 text-[#737373] absolute left-3.5 pointer-events-none"></i>
          <input 
            type="text" 
            name="q" 
            id="mobile-search-input"
            autocomplete="off"
            placeholder="Search for products, brands and more..." 
            class="w-full text-xs bg-[#f5f5f6] border border-transparent rounded-md py-2.5 pl-10 pr-9 text-[#121212] placeholder-[#94969f] focus:outline-none focus:border-gray-400 focus:bg-white"
          />
        </form>
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

    <a href="/account.html" class="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition ${activePage === 'account' || activePage === 'login' || activePage === 'signup' ? 'text-[#121212]' : 'text-[#737373] hover:text-[#121212]'}">
      <i data-lucide="user" class="w-4.5 h-4.5"></i>
      <span class="text-[9px] font-medium tracking-wider uppercase mt-1">Profile</span>
    </a>
  `;
}

function openAccountModal(action) {
  let modal = document.getElementById('aurelia-account-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'aurelia-account-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  let title = 'Account Dossier';
  let bodyContent = '';

  let authUser = { name: 'Arjun Singhania', email: 'member@aurelia.com', phone: '+91 98765 43210' };
  try {
    const raw = localStorage.getItem('aurelia_auth_user');
    if (raw) authUser = Object.assign(authUser, JSON.parse(raw));
  } catch {}

  let savedAddr = { name: 'Arjun Singhania', phone: '9876543210', house: 'Apartment 402, Monolith Residences', loc: 'Indiranagar 100ft Road', city: 'Bengaluru', pin: '560038' };
  try {
    const raw = localStorage.getItem('aurelia_shipping_address');
    if (raw) savedAddr = Object.assign(savedAddr, JSON.parse(raw));
  } catch {}

  if (action === 'orders') {
    title = 'My Orders';
    bodyContent = `
      <div class="space-y-4">
        <div class="border border-[#eaeaec] bg-[#faf9f6] p-4 text-xs space-y-2">
          <div class="flex items-center justify-between border-b border-[#eae8e3] pb-2">
            <div>
              <span class="text-[10px] text-[#737373] uppercase font-bold tracking-wider">Order Reference</span>
              <p class="font-mono font-bold text-sm text-[#121212]">#AUR-2026-89412</p>
            </div>
            <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-xs">
              Dispatched &bull; In Transit
            </span>
          </div>
          <div class="text-[#535766] space-y-1">
            <p><strong>Estimated Delivery:</strong> Within 2-3 Business Days (Demo Courier)</p>
            <p><strong>Dispatch Destination:</strong> ${savedAddr.loc}, ${savedAddr.city}</p>
            <p><strong>Payment Method:</strong> UPI &bull; Pre-Verified</p>
          </div>
          <div class="pt-2 flex gap-2">
            <a href="/help.html" class="flex-1 py-2 bg-[#121212] text-white text-[11px] font-bold uppercase tracking-wider text-center hover:bg-black transition">
              Track in Help Center
            </a>
            <button type="button" class="btn-order-demo-action flex-1 py-2 border border-[#eae8e3] bg-white text-[#121212] text-[11px] font-bold uppercase tracking-wider hover:border-[#121212] transition cursor-pointer">
              View Invoice
            </button>
          </div>
        </div>
        <p class="text-[11px] text-[#737373] text-center italic">* Displaying active demo order. Real orders update dynamically upon checkout.</p>
      </div>
    `;
  } else if (action === 'profile') {
    title = 'My Profile';
    bodyContent = `
      <div class="space-y-4 text-xs">
        <div class="flex items-center gap-4 bg-[#faf9f6] border border-[#eae8e3] p-4">
          <div class="w-12 h-12 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold text-base">
            ${authUser.name ? authUser.name.charAt(0) : 'A'}
          </div>
          <div>
            <h4 class="font-bold text-sm text-[#121212]">${authUser.name}</h4>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#c25e40]">Atelier Privilege Member</span>
          </div>
        </div>

        <div class="divide-y divide-[#eae8e3] border border-[#eae8e3] bg-white p-3">
          <div class="py-2 flex justify-between">
            <span class="text-[#737373]">Email Address</span>
            <span class="font-medium text-[#121212]">${authUser.email}</span>
          </div>
          <div class="py-2 flex justify-between">
            <span class="text-[#737373]">Contact Phone</span>
            <span class="font-medium text-[#121212]">${authUser.phone || '+91 98765 43210'}</span>
          </div>
          <div class="py-2 flex justify-between">
            <span class="text-[#737373]">Saved Delivery City</span>
            <span class="font-medium text-[#121212]">${savedAddr.city}</span>
          </div>
        </div>

        <button type="button" class="btn-switch-to-edit w-full py-2.5 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition cursor-pointer">
          Edit Profile Information
        </button>
      </div>
    `;
  } else if (action === 'editprofile') {
    title = 'Edit Profile';
    bodyContent = `
      <form id="modal-edit-profile-form" class="space-y-3.5 text-xs">
        <div>
          <label class="block font-bold text-[#121212] mb-1 text-[10px] uppercase tracking-wider">Full Name</label>
          <input type="text" id="edit-user-name" value="${authUser.name}" required class="w-full bg-[#faf9f6] border border-[#eae8e3] p-2.5 text-[#121212] focus:outline-none focus:border-[#121212]" />
        </div>
        <div>
          <label class="block font-bold text-[#121212] mb-1 text-[10px] uppercase tracking-wider">Email Address</label>
          <input type="email" id="edit-user-email" value="${authUser.email}" required class="w-full bg-[#faf9f6] border border-[#eae8e3] p-2.5 text-[#121212] focus:outline-none focus:border-[#121212]" />
        </div>
        <div>
          <label class="block font-bold text-[#121212] mb-1 text-[10px] uppercase tracking-wider">Mobile Number</label>
          <input type="tel" id="edit-user-phone" value="${authUser.phone || '9876543210'}" class="w-full bg-[#faf9f6] border border-[#eae8e3] p-2.5 text-[#121212] focus:outline-none focus:border-[#121212]" />
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 py-2.5 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition cursor-pointer">
            Save Changes
          </button>
        </div>
      </form>
    `;
  } else if (action === 'addresses') {
    title = 'Saved Addresses';
    bodyContent = `
      <div class="space-y-4 text-xs">
        <div class="border border-[#121212] bg-[#faf9f6] p-4 space-y-2 relative">
          <div class="flex items-center justify-between">
            <span class="font-bold text-[#121212] flex items-center gap-2">
              <span>${savedAddr.name}</span>
              <span class="bg-[#121212] text-white text-[9px] uppercase px-1.5 py-0.5 tracking-wider font-semibold">Default</span>
            </span>
            <span class="text-[#737373]">+91 ${savedAddr.phone}</span>
          </div>
          <p class="text-[#525252] leading-relaxed">
            ${savedAddr.house}, ${savedAddr.loc}, ${savedAddr.city} — ${savedAddr.pin}
          </p>
        </div>
        <a href="/checkout.html" class="block text-center w-full py-2.5 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition">
          Manage at Checkout
        </a>
      </div>
    `;
  } else if (action === 'giftcards') {
    title = 'Gift Cards & Vouchers';
    bodyContent = `
      <div class="space-y-4 text-xs">
        <div class="border border-[#eae8e3] bg-gradient-to-r from-[#121212] to-[#282c3f] text-white p-5 space-y-3">
          <div class="flex justify-between items-start">
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#d4d4d4]">AURELIA Privilege Gift Card</span>
            <i data-lucide="gift" class="w-4 h-4 text-[#c25e40]"></i>
          </div>
          <div class="pt-2">
            <span class="text-xs text-[#a3a3a3]">Card Balance (Demo):</span>
            <p class="text-2xl font-bold font-mono">₹5,000.00</p>
          </div>
          <p class="text-[10px] text-[#a3a3a3] font-mono">Code: ATELIER-GIFT-5000</p>
        </div>

        <div class="space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#121212] block">Check Card Balance</span>
          <div class="flex gap-2">
            <input type="text" id="giftcard-input" placeholder="Enter 16-digit gift card code" class="w-full bg-[#faf9f6] border border-[#eae8e3] px-3 py-2 text-xs focus:outline-none focus:border-[#121212]" />
            <button type="button" id="check-giftcard-btn" class="bg-[#121212] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition cursor-pointer shrink-0">
              Check
            </button>
          </div>
        </div>

        <a href="/cart.html" class="block text-center w-full py-2.5 border border-[#121212] text-[#121212] text-xs font-bold uppercase tracking-wider hover:bg-[#121212] hover:text-white transition">
          Redeem in Shopping Bag
        </a>
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="bg-white border border-[#eae8e3] max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
      <div class="flex items-center justify-between pb-3 border-b border-[#eae8e3]">
        <h3 class="text-sm font-bold uppercase tracking-wider text-[#121212]">${title}</h3>
        <button type="button" id="close-account-modal" class="p-1 text-[#737373] hover:text-[#121212] cursor-pointer" aria-label="Close modal">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="modal-body-container">
        ${bodyContent}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  createIcons({ icons });

  const closeBtn = document.getElementById('close-account-modal');
  if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  };

  const switchToEdit = modal.querySelector('.btn-switch-to-edit');
  if (switchToEdit) switchToEdit.onclick = () => openAccountModal('editprofile');

  const editForm = document.getElementById('modal-edit-profile-form');
  if (editForm) {
    editForm.onsubmit = (e) => {
      e.preventDefault();
      const n = document.getElementById('edit-user-name').value.trim();
      const em = document.getElementById('edit-user-email').value.trim();
      const ph = document.getElementById('edit-user-phone').value.trim();
      const updated = { name: n, email: em, phone: ph };
      localStorage.setItem('aurelia_auth_user', JSON.stringify(updated));
      toast.success('Profile details updated successfully');
      modal.classList.add('hidden');
      const gn = document.getElementById('profile-greeting-name');
      const gs = document.getElementById('profile-greeting-subtitle');
      if (gn) gn.textContent = `Hello, ${n}`;
      if (gs) gs.textContent = em;
    };
  }

  const checkGiftBtn = document.getElementById('check-giftcard-btn');
  if (checkGiftBtn) {
    checkGiftBtn.onclick = () => {
      const inp = document.getElementById('giftcard-input').value.trim();
      if (!inp) {
        toast.show('Please enter a valid card number');
      } else {
        toast.success('Card Valid! Balance: ₹5,000 available for checkout');
      }
    };
  }

  const invoiceBtn = modal.querySelector('.btn-order-demo-action');
  if (invoiceBtn) {
    invoiceBtn.onclick = () => {
      toast.show('Demo invoice downloaded (PDF)');
    };
  }
}

function bindHeaderInteractions() {
  const searchInput = document.getElementById('header-search-input');
  const clearBtn = document.getElementById('header-search-clear');
  const suggestionsBox = document.getElementById('header-search-suggestions');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  const mobileSearchBtn = document.getElementById('mobile-search-toggle-btn');
  const mobileSearchBar = document.getElementById('mobile-search-bar');
  const mobileSearchInput = document.getElementById('mobile-search-input');

  if (mobileSearchBtn && mobileSearchBar) {
    mobileSearchBtn.addEventListener('click', () => {
      mobileSearchBar.classList.toggle('hidden');
      if (!mobileSearchBar.classList.contains('hidden') && mobileSearchInput) {
        mobileSearchInput.focus();
      }
    });
  }

  const popularSearches = [
    'Belgian Linen',
    'Trench Coats',
    'Blake Loafers',
    'Architectural Trousers',
    'Silk Slip Dress',
    'Leather Objects',
    'Studio Monolith'
  ];

  function showPopularSearches() {
    if (!suggestionsBox) return;
    suggestionsBox.innerHTML = `
      <div class="p-3 border-b border-[#eae8e3] bg-[#faf9f6]">
        <span class="text-[10px] uppercase font-bold tracking-[0.16em] text-[#737373]" title="Popular Atelier Curations">Popular Searches</span>
      </div>
      <div class="p-3 flex flex-wrap gap-1.5">
        ${popularSearches.map((term) => `
          <a 
            href="/shop.html?q=${encodeURIComponent(term)}" 
            class="px-2.5 py-1 text-[11px] font-medium bg-white border border-[#eae8e3] text-[#121212] hover:bg-[#121212] hover:text-white hover:border-[#121212] transition shadow-2xs rounded-xs"
          >
            ${term}
          </a>
        `).join('')}
      </div>
    `;
    suggestionsBox.classList.remove('hidden');
  }

  // Profile Dropdown & Account Actions Controller
  const profileContainer = document.getElementById('profile-menu-container');
  const greetingName = document.getElementById('profile-greeting-name');
  const greetingSubtitle = document.getElementById('profile-greeting-subtitle');
  const authButtons = document.getElementById('profile-auth-buttons');
  const editProfileItem = document.getElementById('profile-edit-item');
  const logoutItem = document.getElementById('profile-logout-item');
  const logoutBtn = document.getElementById('profile-logout-btn');

  function syncProfileUserUI() {
    const authUser = authService.getUser();

    if (authUser && authUser.name) {
      if (greetingName) greetingName.textContent = `Hello, ${authUser.name}`;
      if (greetingSubtitle) greetingSubtitle.textContent = authUser.email || 'Atelier Privilege Member';
      if (authButtons) authButtons.classList.add('hidden');
      if (editProfileItem) editProfileItem.classList.remove('hidden');
      if (logoutItem) logoutItem.classList.remove('hidden');
    } else {
      if (greetingName) greetingName.textContent = 'Hello, Customer';
      if (greetingSubtitle) greetingSubtitle.textContent = 'Welcome to AURELIA Atelier';
      if (authButtons) authButtons.classList.remove('hidden');
      if (editProfileItem) editProfileItem.classList.add('hidden');
      if (logoutItem) logoutItem.classList.add('hidden');
    }
  }

  syncProfileUserUI();
  window.addEventListener('auth:state-changed', syncProfileUserUI);

  if (profileBtn && profileDropdown && profileContainer) {
    let hideTimeout = null;

    const showDropdown = () => {
      clearTimeout(hideTimeout);
      profileDropdown.classList.remove('hidden');
      profileBtn.setAttribute('aria-expanded', 'true');
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        profileDropdown.classList.add('hidden');
        profileBtn.setAttribute('aria-expanded', 'false');
      }, 120);
    };

    // Desktop hover with anti-flicker bridge
    profileContainer.addEventListener('mouseenter', showDropdown);
    profileContainer.addEventListener('mouseleave', hideDropdown);
    profileDropdown.addEventListener('mouseenter', showDropdown);
    profileDropdown.addEventListener('mouseleave', hideDropdown);

    // Click toggle support (desktop + mobile)
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = profileDropdown.classList.contains('hidden');
      if (isHidden) {
        showDropdown();
      } else {
        profileDropdown.classList.add('hidden');
        profileBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileContainer.contains(e.target)) {
        profileDropdown.classList.add('hidden');
        profileBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !profileDropdown.classList.contains('hidden')) {
        profileDropdown.classList.add('hidden');
        profileBtn.setAttribute('aria-expanded', 'false');
        profileBtn.focus();
      }
    });

    // Logout handler
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to log out of your AURELIA account?')) {
          authService.logout();
          syncProfileUserUI();
          profileDropdown.classList.add('hidden');
          toast.success('Logged out successfully');
          if (window.location.pathname.includes('account.html')) {
            window.location.href = '/index.html';
          }
        }
      });
    }

    // Navigation triggers for account options
    document.querySelectorAll('.profile-action-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        profileDropdown.classList.add('hidden');
        const action = btn.dataset.action;
        const targetTab = action === 'editprofile' ? 'profile' : action;

        if (authService.isLoggedIn()) {
          // Logged In: directly navigate to requested account dashboard tab
          window.location.href = `/account.html?tab=${targetTab}`;
        } else {
          // Logged Out: redirect to login with preserved redirect destination
          const redirectDest = `/account.html?tab=${targetTab}`;
          window.location.href = `/login.html?redirect=${encodeURIComponent(redirectDest)}`;
        }
      });
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

    searchInput.addEventListener('focus', () => {
      if (!searchInput.value.trim()) {
        showPopularSearches();
      }
    });

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
    <!-- Myntra-Style Marketplace Trust & Assurance Banner -->
    <section class="bg-[#F8F7F4] border-t border-[#eae8e3] py-5 sm:py-6">
      <div class="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
          
          <div class="footer-trust-card flex items-center gap-3 p-3 bg-white border border-[#eae8e3] rounded-xs shadow-2xs h-full">
            <div class="w-10 h-10 rounded-full bg-[#F8F7F4] border border-[#eae8e3] flex items-center justify-center shrink-0">
              <i data-lucide="shield-check" class="w-5 h-5 text-[#121212]"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#121212] leading-tight truncate">100% Original Guarantee</h4>
              <p class="text-[11px] text-[#535766] mt-0.5 leading-snug">Verified authentic natural fibers and atelier craftsmanship.</p>
            </div>
          </div>

          <div class="footer-trust-card flex items-center gap-3 p-3 bg-white border border-[#eae8e3] rounded-xs shadow-2xs h-full">
            <div class="w-10 h-10 rounded-full bg-[#F8F7F4] border border-[#eae8e3] flex items-center justify-center shrink-0">
              <i data-lucide="rotate-ccw" class="w-5 h-5 text-[#121212]"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#121212] leading-tight truncate">14 Days Return & Exchange</h4>
              <p class="text-[11px] text-[#535766] mt-0.5 leading-snug">Hassle-free complimentary doorstep reverse pickups.</p>
            </div>
          </div>

          <div class="footer-trust-card flex items-center gap-3 p-3 bg-white border border-[#eae8e3] rounded-xs shadow-2xs h-full">
            <div class="w-10 h-10 rounded-full bg-[#F8F7F4] border border-[#eae8e3] flex items-center justify-center shrink-0">
              <i data-lucide="truck" class="w-5 h-5 text-[#121212]"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#121212] leading-tight truncate">Free Express Delivery</h4>
              <p class="text-[11px] text-[#535766] mt-0.5 leading-snug">Fast doorstep delivery on all orders above ₹2,500.</p>
            </div>
          </div>

          <div class="footer-trust-card flex items-center gap-3 p-3 bg-white border border-[#eae8e3] rounded-xs shadow-2xs h-full">
            <div class="w-10 h-10 rounded-full bg-[#F8F7F4] border border-[#eae8e3] flex items-center justify-center shrink-0">
              <i data-lucide="sparkles" class="w-5 h-5 text-[#c25e40]"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#121212] leading-tight truncate">Atelier Privilege Benefits</h4>
              <p class="text-[11px] text-[#535766] mt-0.5 leading-snug">Flat 15% off with code <strong>ATELIER2026</strong> on checkout.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Myntra-Inspired Multi-Column Footer -->
    <footer class="bg-[#F8F7F4] text-[#535766] pt-8 sm:pt-10 pb-6 sm:pb-8 text-xs font-sans border-t border-[#eae8e3]">
      <div class="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-[#eaeaec]">
          
          <!-- Column 1: Online Shopping Links -->
          <div class="sm:col-span-1 md:col-span-2 lg:col-span-3 space-y-2.5">
            <h4 class="text-[11px] font-bold tracking-[0.14em] text-[#282c3f] uppercase block">Online Shopping</h4>
            <ul class="space-y-1.5 text-[11px] sm:text-xs text-[#535766]">
              <li><a href="/shop.html?category=men" class="hover:text-[#121212] hover:font-medium transition">Men's Apparel</a></li>
              <li><a href="/shop.html?category=women" class="hover:text-[#121212] hover:font-medium transition">Women's Collection</a></li>
              <li><a href="/shop.html?category=footwear" class="hover:text-[#121212] hover:font-medium transition">Artisanal Footwear</a></li>
              <li><a href="/shop.html?category=accessories" class="hover:text-[#121212] hover:font-medium transition">Leather & Accessories</a></li>
              <li><a href="/shop.html?sort=newest" class="hover:text-[#121212] hover:font-medium transition">New Arrivals</a></li>
              <li><a href="/shop.html" class="hover:text-[#121212] hover:font-medium transition">Studio Edit</a></li>
            </ul>
          </div>

          <!-- Column 2: Customer Policies -->
          <div class="sm:col-span-1 md:col-span-2 lg:col-span-3 space-y-2.5">
            <h4 class="text-[11px] font-bold tracking-[0.14em] text-[#282c3f] uppercase block">Customer Policies</h4>
            <ul class="space-y-1.5 text-[11px] sm:text-xs text-[#535766]">
              <li><a href="/help.html" class="hover:text-[#121212] font-semibold text-[#c25e40] transition">Need Help? Contact Us</a></li>
              <li><a href="/help.html" class="hover:text-[#121212] hover:font-medium transition">Help Center & FAQs</a></li>
              <li><a href="/cart.html" class="hover:text-[#121212] hover:font-medium transition">Shopping Bag</a></li>
              <li><a href="/wishlist.html" class="hover:text-[#121212] hover:font-medium transition">Saved Wishlist</a></li>
              <li><a href="/checkout.html" class="hover:text-[#121212] hover:font-medium transition">Order Settlement</a></li>
              <li><a href="/shop.html" class="hover:text-[#121212] hover:font-medium transition">Shipping & Delivery</a></li>
              <li><span class="text-gray-400">14-Day Returns & Exchanges</span></li>
            </ul>
          </div>

          <!-- Column 3: Experience App & Connect -->
          <div class="sm:col-span-1 md:col-span-2 lg:col-span-3 space-y-2.5">
            <h4 class="text-[11px] font-bold tracking-[0.14em] text-[#282c3f] uppercase block">Experience AURELIA On Mobile</h4>
            <p class="text-[11px] sm:text-xs text-[#535766] leading-relaxed">Download our mobile companion for private releases and express bag management.</p>
            <div class="flex items-center gap-2 pt-0.5">
              <span class="inline-block px-2.5 py-1 bg-[#121212] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-xs cursor-pointer">Google Play</span>
              <span class="inline-block px-2.5 py-1 bg-[#121212] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-xs cursor-pointer">App Store</span>
            </div>
            <div class="pt-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#282c3f] block mb-1.5">Keep in Touch</span>
              <div class="flex gap-4 text-xs font-semibold text-[#535766]">
                <a href="#" class="hover:text-black transition">Instagram</a>
                <a href="#" class="hover:text-black transition">Pinterest</a>
                <a href="#" class="hover:text-black transition">Twitter</a>
              </div>
            </div>
          </div>

          <!-- Column 4: Newsletter -->
          <div class="sm:col-span-1 md:col-span-2 lg:col-span-3 space-y-2.5">
            <h4 class="text-[11px] font-bold tracking-[0.14em] text-[#282c3f] uppercase block">Atelier Newsletter</h4>
            <p class="text-[11px] sm:text-xs text-[#535766] leading-relaxed">Get updates about new drops, seasonal sales, and member-only privilege vouchers.</p>
            <form id="newsletter-form" class="flex gap-2 pt-1">
              <input 
                type="email" 
                id="newsletter-email"
                required
                autocomplete="email"
                placeholder="Your email address" 
                class="bg-white border border-[#eaeaec] text-xs text-gray-900 px-3 py-2 rounded-xs flex-1 focus:outline-none focus:border-gray-400"
              />
              <button type="submit" class="bg-[#121212] text-white px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase hover:bg-black transition cursor-pointer rounded-xs shrink-0">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <!-- Popular Searches Index Bar -->
        <div class="py-3 sm:py-3.5 border-b border-[#eaeaec] text-[11px] text-[#737373] leading-relaxed">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span class="font-bold text-[#282c3f] uppercase text-[10px] tracking-wider shrink-0 mr-1">Popular Searches:</span>
            <a href="/shop.html?category=men&q=linen" class="hover:underline hover:text-[#121212] transition">Linen Shirts</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?category=men&q=trench" class="hover:underline hover:text-[#121212] transition">Trench Coats</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?category=women&q=dress" class="hover:underline hover:text-[#121212] transition">Silk Slip Dresses</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?category=men&q=trousers" class="hover:underline hover:text-[#121212] transition">Pleated Trousers</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?category=footwear&q=loafer" class="hover:underline hover:text-[#121212] transition">Blake Loafers</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?category=accessories&q=tote" class="hover:underline hover:text-[#121212] transition">Leather Totes</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?brand=STUDIO%20MONOLITH" class="hover:underline hover:text-[#121212] transition">Studio Monolith</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?brand=AURELIA%20ATELIER" class="hover:underline hover:text-[#121212] transition">Aurelia Atelier</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?brand=KAIRO%20FORM" class="hover:underline hover:text-[#121212] transition">Kairo Form</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?brand=VELLUM%20%26%20CO." class="hover:underline hover:text-[#121212] transition">Vellum & Co.</a>
            <span class="text-[#d4d4d4]">&bull;</span>
            <a href="/shop.html?brand=ATELIER%20%C3%89PURE" class="hover:underline hover:text-[#121212] transition">Atelier Épure</a>
          </div>
        </div>

        <!-- Copyright & Policies -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 sm:pt-5 text-[11px] text-[#94969f]">
          <p>&copy; 2026 AURELIA Atelier. Modern Fashion Marketplace.</p>
          <div class="flex gap-4 sm:gap-6 text-[11px]">
            <a href="/shop.html" class="hover:text-black transition">Privacy Policy</a>
            <a href="/shop.html" class="hover:text-black transition">Terms of Order</a>
            <a href="/shop.html" class="hover:text-black transition">Authenticity Guarantee</a>
          </div>
        </div>

      </div>
    </footer>
  `;
}
