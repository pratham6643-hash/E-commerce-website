import { initLayout } from '../components/layout.js';
import { authService } from '../services/auth.js';
import { store } from '../services/store.js';
import { toast } from '../components/toast.js';
import { formatCurrency } from '../utils/helpers.js';
import {
  createIcons,
  LayoutDashboard,
  Package,
  Tag,
  Gift,
  User,
  MapPin,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
  ArrowRight,
  Trash2,
  Edit,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
} from 'lucide';

const icons = {
  LayoutDashboard,
  Package,
  Tag,
  Gift,
  User,
  MapPin,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
  ArrowRight,
  Trash2,
  Edit,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
};

const ORDERS_KEY = 'aurelia_orders';
const ADDRESSES_KEY = 'aurelia_saved_addresses';
const SHIPPING_KEY = 'aurelia_shipping_address';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Route Protection: Redirect to login if customer is logged out
  if (!authService.isLoggedIn()) {
    const dest = window.location.pathname + window.location.search + window.location.hash;
    window.location.replace('/login.html?redirect=' + encodeURIComponent(dest));
    return;
  }

  initLayout('account');

  // DOM Elements
  const headerName = document.getElementById('account-header-name');
  const headerEmail = document.getElementById('account-header-email');
  const avatarInitial = document.getElementById('account-avatar-initial');
  const breadcrumbTab = document.getElementById('account-breadcrumb-tab');
  const navButtons = document.querySelectorAll('.account-nav-btn');
  const panels = document.querySelectorAll('.account-panel');
  const headerLogoutBtn = document.getElementById('account-header-logout-btn');
  const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');

  // Count Badges
  const overviewOrdersCount = document.getElementById('overview-orders-count');
  const overviewWishlistCount = document.getElementById('overview-wishlist-count');
  const overviewAddressesCount = document.getElementById('overview-addresses-count');
  const sidebarOrderBadge = document.getElementById('sidebar-order-count-badge');
  const sidebarWishlistBadge = document.getElementById('sidebar-wishlist-count-badge');

  // Overview snapshot fields
  const overviewName = document.getElementById('overview-profile-name');
  const overviewEmail = document.getElementById('overview-profile-email');
  const overviewPhone = document.getElementById('overview-profile-phone');
  const overviewAddress = document.getElementById('overview-profile-address');
  const overviewRecentOrderContainer = document.getElementById('overview-recent-order-container');

  // Profile Form Elements
  const profileForm = document.getElementById('account-profile-form');
  const profNameInput = document.getElementById('prof-name');
  const profEmailInput = document.getElementById('prof-email');
  const profPhoneInput = document.getElementById('prof-phone');
  const profDobInput = document.getElementById('prof-dob');

  // Addresses Elements
  const addressesContainer = document.getElementById('addresses-list-container');
  const btnAddNewAddress = document.getElementById('btn-add-new-address');
  const addressFormContainer = document.getElementById('address-form-container');
  const addressFormTitle = document.getElementById('address-form-title');
  const btnCancelAddressForm = document.getElementById('btn-cancel-address-form');
  const btnCancelAddress = document.getElementById('btn-cancel-address');
  const accountAddressForm = document.getElementById('account-address-form');

  const addrIdInput = document.getElementById('addr-id');
  const addrNameInput = document.getElementById('addr-name');
  const addrPhoneInput = document.getElementById('addr-phone');
  const addrHouseInput = document.getElementById('addr-house');
  const addrLocInput = document.getElementById('addr-loc');
  const addrCityInput = document.getElementById('addr-city');
  const addrPinInput = document.getElementById('addr-pin');
  const addrDefaultCheckbox = document.getElementById('addr-default');

  // Wishlist Grid
  const wishlistGrid = document.getElementById('account-wishlist-grid');

  // Orders Container
  const ordersContainer = document.getElementById('orders-list-container');

  // Gift Card Verify
  const btnCheckGc = document.getElementById('btn-check-gc');
  const gcInput = document.getElementById('gc-input');

  // --- Initial Data Seeding & Getters ---

  function getOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}

    // Seed realistic initial demo order
    const initialOrders = [
      {
        id: 'AUR-2026-89412',
        date: '20 Nov 2026',
        status: 'In Transit',
        statusBadge: 'Dispatched • In Transit',
        statusColor: 'emerald',
        total: 8500,
        items: [
          {
            id: 'aur-01',
            name: 'Belgian Raw Linen Overshirt',
            brand: 'STUDIO MONOLITH',
            selectedSize: 'M',
            quantity: 1,
            price: 4800,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&auto=format&fit=crop&q=80',
          },
          {
            id: 'aur-07',
            name: 'Structured Canvas Tote',
            brand: 'VELLUM & CO.',
            selectedSize: 'Universal',
            quantity: 1,
            price: 3700,
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&auto=format&fit=crop&q=80',
          },
        ],
        address: {
          name: 'Arjun Singhania',
          house: 'Apartment 402, Monolith Residences',
          loc: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          pin: '560038',
        },
      },
    ];

    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
    } catch {}

    return initialOrders;
  }

  function getAddresses() {
    try {
      const raw = localStorage.getItem(ADDRESSES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // Check single shipping address key
    let single = null;
    try {
      const s = localStorage.getItem(SHIPPING_KEY);
      if (s) single = JSON.parse(s);
    } catch {}

    const defaultAddress = single || {
      name: 'Arjun Singhania',
      phone: '9876543210',
      house: 'Apartment 402, Monolith Residences',
      loc: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      pin: '560038',
    };

    const initialAddresses = [
      {
        id: 'addr-' + Date.now(),
        name: defaultAddress.name,
        phone: defaultAddress.phone,
        house: defaultAddress.house,
        loc: defaultAddress.loc,
        city: defaultAddress.city,
        pin: defaultAddress.pin,
        isDefault: true,
      },
    ];

    saveAddresses(initialAddresses);
    return initialAddresses;
  }

  function saveAddresses(addresses) {
    try {
      localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
      // Keep primary single shipping address in sync for checkout
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      if (def) {
        localStorage.setItem(
          SHIPPING_KEY,
          JSON.stringify({
            name: def.name,
            phone: def.phone,
            house: def.house,
            loc: def.loc,
            city: def.city,
            pin: def.pin,
          })
        );
      }
    } catch (e) {
      console.warn('Address persistence error:', e);
    }
  }

  // --- Render Functions ---

  function syncHeaderAndOverview() {
    const user = authService.getUser() || {};
    const name = user.name || 'Customer';
    const email = user.email || 'member@aurelia.com';
    const phone = user.phone || '9876543210';

    if (headerName) headerName.textContent = name;
    if (headerEmail) headerEmail.textContent = email;
    if (avatarInitial) avatarInitial.textContent = name.charAt(0).toUpperCase();

    if (overviewName) overviewName.textContent = name;
    if (overviewEmail) overviewEmail.textContent = email;
    if (overviewPhone) overviewPhone.textContent = `+91 ${phone.replace(/^\+?91\s*/, '')}`;

    // Counts
    const orders = getOrders();
    const addresses = getAddresses();
    const wishlist = store.getWishlist();

    if (overviewOrdersCount) overviewOrdersCount.textContent = orders.length;
    if (sidebarOrderBadge) sidebarOrderBadge.textContent = orders.length;

    if (overviewWishlistCount) overviewWishlistCount.textContent = wishlist.length;
    if (sidebarWishlistBadge) sidebarWishlistBadge.textContent = wishlist.length;

    if (overviewAddressesCount) overviewAddressesCount.textContent = addresses.length;

    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
    if (overviewAddress) {
      overviewAddress.textContent = defaultAddr
        ? `${defaultAddr.loc}, ${defaultAddr.city}`
        : 'No saved address';
    }

    // Populate Overview Recent Order
    if (overviewRecentOrderContainer) {
      if (orders.length === 0) {
        overviewRecentOrderContainer.innerHTML = `
          <div class="py-4 text-center text-xs text-[#737373]">
            You have placed no orders yet. <a href="/shop.html" class="text-[#121212] font-bold underline">Explore collection</a>.
          </div>
        `;
      } else {
        const o = orders[0];
        overviewRecentOrderContainer.innerHTML = `
          <div class="border border-[#eae8e3] bg-[#faf9f6] p-4 text-xs space-y-3">
            <div class="flex items-center justify-between border-b border-[#eae8e3] pb-2">
              <div>
                <span class="text-[10px] text-[#737373] uppercase font-bold tracking-wider">Order ID</span>
                <p class="font-mono font-bold text-sm text-[#121212]">${o.id}</p>
              </div>
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-xs">
                ${o.statusBadge || o.status}
              </span>
            </div>
            <div class="flex items-center gap-3">
              ${o.items && o.items[0] ? `
                <img src="${o.items[0].image}" alt="${o.items[0].name}" class="w-12 h-16 object-cover bg-white border border-[#eae8e3] shrink-0" />
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-[#121212] truncate">${o.items[0].name}</h4>
                  <p class="text-[11px] text-[#737373] mt-0.5">${o.items.length > 1 ? `+${o.items.length - 1} more item(s)` : `Size: ${o.items[0].selectedSize || 'M'}`}</p>
                  <p class="font-bold text-[#121212] mt-1">${formatCurrency(o.total)}</p>
                </div>
              ` : ''}
            </div>
            <div class="pt-2 flex gap-2">
              <button type="button" class="flex-1 py-2 bg-[#121212] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black transition cursor-pointer" onclick="window.accountSwitchTab('orders')">
                View Order Details
              </button>
              <a href="/help.html" class="flex-1 py-2 border border-[#eae8e3] bg-white text-[#121212] text-[11px] font-bold uppercase tracking-wider text-center hover:border-[#121212] transition">
                Track in Help Center
              </a>
            </div>
          </div>
        `;
      }
    }
  }

  function renderOrdersList() {
    if (!ordersContainer) return;
    const orders = getOrders();

    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="bg-white border border-[#eae8e3] p-12 text-center space-y-4">
          <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto text-[#a3a3a3]"></i>
          <h3 class="font-editorial text-2xl text-[#121212]">No Orders Yet</h3>
          <p class="text-xs text-[#737373] max-w-sm mx-auto">
            You haven't placed any orders with AURELIA Atelier yet. Explore our handcrafted pieces.
          </p>
          <a href="/shop.html" class="inline-block bg-[#121212] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-black transition">
            Start Shopping
          </a>
        </div>
      `;
      createIcons({ icons });
      return;
    }

    ordersContainer.innerHTML = orders.map((o) => `
      <div class="bg-white border border-[#eae8e3] p-5 shadow-2xs space-y-4">
        <!-- Order Header Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#eae8e3] gap-2 text-xs">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-[#121212] font-mono">${o.id}</span>
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-xs">
                ${o.statusBadge || o.status}
              </span>
            </div>
            <p class="text-[11px] text-[#737373] mt-0.5">Placed on ${o.date} &bull; Delivery to ${o.address ? `${o.address.loc}, ${o.address.city}` : 'Saved Address'}</p>
          </div>
          <div class="text-left sm:text-right">
            <span class="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">Total Amount</span>
            <span class="text-sm font-bold text-[#121212]">${formatCurrency(o.total)}</span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="divide-y divide-[#eae8e3]">
          ${o.items.map((item) => `
            <div class="py-3 flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-3">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-18 object-cover bg-[#f5f4ef] border border-[#eae8e3] shrink-0" />
                <div>
                  <span class="text-[9px] uppercase font-bold text-[#737373] tracking-wider block">${item.brand}</span>
                  <h4 class="font-bold text-[#121212] text-xs">${item.name}</h4>
                  <div class="flex items-center gap-2 text-[11px] text-[#535766] mt-1">
                    <span>Size: ${item.selectedSize || 'M'}</span>
                    <span>&bull;</span>
                    <span>Qty: ${item.quantity || 1}</span>
                  </div>
                </div>
              </div>
              <span class="font-bold text-[#121212] text-xs">${formatCurrency(item.price * (item.quantity || 1))}</span>
            </div>
          `).join('')}
        </div>

        <!-- Order Action Buttons -->
        <div class="pt-3 border-t border-[#eae8e3] flex flex-wrap gap-2 text-xs">
          <a href="/help.html" class="flex-1 min-w-[140px] py-2 bg-[#121212] text-white text-[11px] font-bold uppercase tracking-wider text-center hover:bg-black transition">
            Track Dispatch
          </a>
          <button type="button" class="btn-download-invoice flex-1 min-w-[140px] py-2 border border-[#eae8e3] bg-white text-[#121212] text-[11px] font-bold uppercase tracking-wider hover:border-[#121212] transition cursor-pointer" data-id="${o.id}">
            Download Invoice
          </button>
          <button type="button" class="btn-return-order flex-1 min-w-[140px] py-2 border border-[#eae8e3] bg-white text-[#737373] hover:text-[#121212] text-[11px] font-bold uppercase tracking-wider hover:border-[#121212] transition cursor-pointer" data-id="${o.id}">
            Exchange / Return
          </button>
        </div>
      </div>
    `).join('');

    // Bind Order Action Events
    ordersContainer.querySelectorAll('.btn-download-invoice').forEach((btn) => {
      btn.addEventListener('click', () => {
        toast.success(`Demo invoice downloaded for ${btn.dataset.id} (PDF)`);
      });
    });

    ordersContainer.querySelectorAll('.btn-return-order').forEach((btn) => {
      btn.addEventListener('click', () => {
        toast.show(`Return request initiated for ${btn.dataset.id}. Complimentary courier pickup scheduled.`);
      });
    });

    createIcons({ icons });
  }

  function renderAddressesList() {
    if (!addressesContainer) return;
    const addresses = getAddresses();

    addressesContainer.innerHTML = addresses.map((addr) => `
      <div class="bg-white border ${addr.isDefault ? 'border-[#121212]' : 'border-[#eae8e3]'} p-5 shadow-2xs space-y-3 relative flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-[#121212] flex items-center gap-2">
              <span>${addr.name}</span>
              ${addr.isDefault ? `
                <span class="bg-[#121212] text-white text-[9px] uppercase px-1.5 py-0.5 tracking-wider font-semibold rounded-xs">Default</span>
              ` : ''}
            </span>
            <span class="text-xs font-semibold text-[#737373]">+91 ${addr.phone}</span>
          </div>

          <p class="text-xs text-[#525252] mt-2 leading-relaxed">
            ${addr.house}, ${addr.loc}<br />
            ${addr.city} — <strong>${addr.pin}</strong>
          </p>
        </div>

        <div class="pt-3 border-t border-[#eae8e3] flex items-center justify-between gap-2 text-xs">
          <div class="flex gap-3">
            <button type="button" class="btn-edit-addr text-[11px] font-bold text-[#121212] hover:underline cursor-pointer" data-id="${addr.id}">
              Edit
            </button>
            ${!addr.isDefault ? `
              <button type="button" class="btn-delete-addr text-[11px] font-bold text-red-600 hover:underline cursor-pointer" data-id="${addr.id}">
                Delete
              </button>
            ` : ''}
          </div>

          ${!addr.isDefault ? `
            <button type="button" class="btn-set-default-addr text-[10px] font-bold uppercase tracking-wider text-[#737373] hover:text-[#121212] cursor-pointer" data-id="${addr.id}">
              Set Default
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Bind Address Action Events
    addressesContainer.querySelectorAll('.btn-edit-addr').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const target = addresses.find((a) => a.id === id);
        if (target) {
          addrIdInput.value = target.id;
          addrNameInput.value = target.name;
          addrPhoneInput.value = target.phone;
          addrHouseInput.value = target.house;
          addrLocInput.value = target.loc;
          addrCityInput.value = target.city;
          addrPinInput.value = target.pin;
          addrDefaultCheckbox.checked = !!target.isDefault;

          if (addressFormTitle) addressFormTitle.textContent = 'Edit Address';
          if (addressFormContainer) addressFormContainer.classList.remove('hidden');
          addressFormContainer.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    addressesContainer.querySelectorAll('.btn-delete-addr').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('Delete this delivery address?')) {
          const updated = addresses.filter((a) => a.id !== id);
          saveAddresses(updated);
          renderAddressesList();
          syncHeaderAndOverview();
          toast.success('Address removed');
        }
      });
    });

    addressesContainer.querySelectorAll('.btn-set-default-addr').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const updated = addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));
        saveAddresses(updated);
        renderAddressesList();
        syncHeaderAndOverview();
        toast.success('Default delivery address updated');
      });
    });

    createIcons({ icons });
  }

  function renderWishlistGrid() {
    if (!wishlistGrid) return;
    const wishlist = store.getWishlist();

    if (wishlist.length === 0) {
      wishlistGrid.innerHTML = `
        <div class="col-span-full bg-white border border-[#eae8e3] p-12 text-center space-y-4">
          <i data-lucide="heart" class="w-12 h-12 mx-auto text-[#a3a3a3]"></i>
          <h3 class="font-editorial text-2xl text-[#121212]">Your Wishlist is Empty</h3>
          <p class="text-xs text-[#737373] max-w-sm mx-auto font-light">
            Bookmark seasonal tailoring and luxury items to save them here.
          </p>
          <a href="/shop.html" class="inline-block bg-[#121212] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-black transition">
            Browse Atelier Collection
          </a>
        </div>
      `;
      createIcons({ icons });
      return;
    }

    wishlistGrid.innerHTML = wishlist.map((p) => `
      <article class="bg-white border border-[#eae8e3] p-3 flex flex-col justify-between shadow-2xs group">
        <div>
          <div class="relative aspect-[3/4] bg-[#f8f8f9] overflow-hidden mb-2">
            <a href="/product.html?id=${p.id}" class="block w-full h-full">
              <img src="${p.images ? p.images[0] : p.image}" alt="${p.name}" class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500" loading="lazy" />
            </a>
            <button type="button" class="btn-remove-wishlist absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-[#737373] hover:text-black flex items-center justify-center shadow-xs cursor-pointer" data-id="${p.id}" title="Remove from wishlist">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <span class="text-[10px] uppercase font-bold text-[#737373] tracking-wider block truncate">${p.brand}</span>
          <h4 class="text-xs font-medium text-[#121212] truncate mt-0.5">${p.name}</h4>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs font-bold text-[#121212]">${formatCurrency(p.price)}</span>
            ${p.originalPrice && p.originalPrice > p.price ? `
              <span class="text-[10px] text-[#737373] line-through">${formatCurrency(p.originalPrice)}</span>
            ` : ''}
          </div>
        </div>

        <button type="button" class="btn-move-to-bag w-full mt-3 py-2 bg-[#121212] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer" data-id="${p.id}">
          Move to Bag
        </button>
      </article>
    `).join('');

    // Bind Wishlist Actions
    wishlistGrid.querySelectorAll('.btn-remove-wishlist').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        store.removeFromWishlist(id);
        renderWishlistGrid();
        syncHeaderAndOverview();
        toast.show('Removed from Wishlist');
      });
    });

    wishlistGrid.querySelectorAll('.btn-move-to-bag').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = wishlist.find((p) => p.id === id);
        if (item) {
          store.addToCart(item, item.selectedSize || 'M', 1);
          store.removeFromWishlist(id);
          renderWishlistGrid();
          syncHeaderAndOverview();
          toast.success('Added to Bag & removed from Wishlist');
        }
      });
    });

    createIcons({ icons });
  }

  function initProfileForm() {
    const user = authService.getUser() || {};
    if (profNameInput) profNameInput.value = user.name || 'Arjun Singhania';
    if (profEmailInput) profEmailInput.value = user.email || 'member@aurelia.com';
    if (profPhoneInput) profPhoneInput.value = (user.phone || '9876543210').replace(/^\+?91\s*/, '');
    if (profDobInput) profDobInput.value = user.dob || '1994-08-15';

    const genderVal = user.gender || 'Male';
    const genderRadio = document.querySelector(`input[name="prof-gender"][value="${genderVal}"]`);
    if (genderRadio) genderRadio.checked = true;

    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedGender = document.querySelector('input[name="prof-gender"]:checked')?.value || 'Male';
        const updated = {
          name: profNameInput.value.trim(),
          email: profEmailInput.value.trim(),
          phone: profPhoneInput.value.trim(),
          dob: profDobInput.value,
          gender: selectedGender,
        };

        authService.updateProfile(updated);
        syncHeaderAndOverview();
        toast.success('Profile details successfully updated');
      });
    }
  }

  function initAddressForm() {
    if (btnAddNewAddress && addressFormContainer) {
      btnAddNewAddress.addEventListener('click', () => {
        accountAddressForm.reset();
        addrIdInput.value = '';
        if (addressFormTitle) addressFormTitle.textContent = 'Add New Address';
        addressFormContainer.classList.remove('hidden');
        addressFormContainer.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const hideForm = () => {
      if (addressFormContainer) addressFormContainer.classList.add('hidden');
    };

    if (btnCancelAddressForm) btnCancelAddressForm.addEventListener('click', hideForm);
    if (btnCancelAddress) btnCancelAddress.addEventListener('click', hideForm);

    if (accountAddressForm) {
      accountAddressForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = addrIdInput.value || 'addr-' + Date.now();
        const name = addrNameInput.value.trim();
        const phone = addrPhoneInput.value.trim();
        const house = addrHouseInput.value.trim();
        const loc = addrLocInput.value.trim();
        const city = addrCityInput.value.trim();
        const pin = addrPinInput.value.trim();
        const isDefault = addrDefaultCheckbox.checked;

        if (!name || !phone || !house || !loc || !city || !pin) {
          toast.show('Please fill in all required address fields');
          return;
        }

        const addresses = getAddresses();
        const existingIdx = addresses.findIndex((a) => a.id === id);

        const newAddr = { id, name, phone, house, loc, city, pin, isDefault };

        if (existingIdx > -1) {
          addresses[existingIdx] = newAddr;
        } else {
          addresses.push(newAddr);
        }

        // If marked default, unmark others
        if (isDefault) {
          addresses.forEach((a) => {
            if (a.id !== id) a.isDefault = false;
          });
        }

        saveAddresses(addresses);
        hideForm();
        renderAddressesList();
        syncHeaderAndOverview();
        toast.success('Address saved successfully');
      });
    }
  }

  function initGiftCardChecker() {
    if (btnCheckGc && gcInput) {
      btnCheckGc.addEventListener('click', () => {
        const val = gcInput.value.trim();
        if (!val) {
          toast.show('Please enter a valid gift card number');
        } else {
          toast.success('Card Verified! Available Demo Balance: ₹5,000.00');
        }
      });
    }

    document.querySelectorAll('.btn-copy-coupon').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            toast.success(`Coupon code "${code}" copied to clipboard!`);
          }).catch(() => {
            toast.success(`Coupon code "${code}" active`);
          });
        }
      });
    });
  }

  // --- Tab Navigation Switcher ---

  window.accountSwitchTab = function (tabId) {
    if (!tabId) tabId = 'overview';

    // Update active class on nav buttons
    navButtons.forEach((btn) => {
      const match = btn.dataset.tab === tabId;
      if (match) {
        btn.classList.add('bg-[#121212]', 'text-white');
        btn.classList.remove('text-[#535766]', 'bg-white', 'text-[#121212]');
        const icon = btn.querySelector('svg');
        if (icon) icon.classList.add('text-white');
      } else {
        btn.classList.remove('bg-[#121212]', 'text-white');
        btn.classList.add('text-[#535766]');
        const icon = btn.querySelector('svg');
        if (icon) icon.classList.remove('text-white');
      }
    });

    // Show active panel
    panels.forEach((p) => {
      p.classList.add('hidden');
    });

    const activePanel = document.getElementById(`panel-${tabId}`);
    if (activePanel) {
      activePanel.classList.remove('hidden');
    }

    // Update Breadcrumb
    if (breadcrumbTab) {
      const titles = {
        overview: 'Overview',
        orders: 'Orders & Returns',
        profile: 'Profile Details',
        addresses: 'Saved Addresses',
        payments: 'Saved Payments',
        wishlist: 'Wishlist',
        coupons: 'Coupons',
        giftcards: 'Gift Cards',
      };
      breadcrumbTab.textContent = titles[tabId] || 'Overview';
    }

    // Re-render sub components for active tab
    if (tabId === 'orders') renderOrdersList();
    if (tabId === 'addresses') renderAddressesList();
    if (tabId === 'wishlist') renderWishlistGrid();

    // Update URL hash / query without reloading
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url);

    createIcons({ icons });
  };

  // Bind sidebar nav buttons
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      window.accountSwitchTab(tab);
    });
  });

  // Logout Handlers
  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of your AURELIA account?')) {
      authService.logout();
      toast.success('Logged out successfully');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 700);
    }
  };

  if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', handleLogout);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);

  // Initialize Page State
  const initialParams = new URLSearchParams(window.location.search);
  const initialTab = initialParams.get('tab') || 'overview';

  syncHeaderAndOverview();
  initProfileForm();
  initAddressForm();
  initGiftCardChecker();
  window.accountSwitchTab(initialTab);

  createIcons({ icons });
});
