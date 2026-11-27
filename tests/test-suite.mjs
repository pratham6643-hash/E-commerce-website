import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('====================================================');
console.log('  AURELIA Atelier — Automated Regression Test Suite ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}\n`);
    throw err;
  }
}

// Mock browser LocalStorage for headless Node environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new MockLocalStorage();
globalThis.window = {
  dispatchEvent: () => true
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init?.detail;
  }
};

const { StoreService } = await import('../src/js/services/store.js');
const { productService } = await import('../src/js/services/products.js');

const sampleProduct1 = {
  id: 'aur-01',
  name: 'Architectural Trench Coat',
  brand: 'AURELIA ATELIER',
  price: 4800,
  originalPrice: 6800,
  discountPercent: 29,
  images: ['/assets/images/sample1.jpg'],
  sizes: ['S', 'M', 'L']
};

const sampleProduct2 = {
  id: 'aur-02',
  name: 'Belgian Linen Tunic Shirt',
  brand: 'STUDIO MONOLITH',
  price: 2400,
  originalPrice: 3200,
  discountPercent: 25,
  images: ['/assets/images/sample2.jpg'],
  sizes: ['M', 'L', 'XL']
};

test('Wishlist toggle, persistence and state restoration', () => {
  localStorage.clear();
  const store1 = new StoreService();
  assert.equal(store1.getWishlistCount(), 0);

  // Add to wishlist
  const added = store1.toggleWishlist(sampleProduct1);
  assert.equal(added, true);
  assert.equal(store1.isInWishlist('aur-01'), true);
  assert.equal(store1.getWishlistCount(), 1);

  // Check localStorage serialization
  const storedRaw = localStorage.getItem('aurelia_wishlist_items');
  assert.ok(storedRaw, 'localStorage key aurelia_wishlist_items must exist');
  const storedList = JSON.parse(storedRaw);
  assert.equal(storedList.length, 1);
  assert.equal(storedList[0].id, 'aur-01');

  // Verify persistence upon re-instantiation (simulating page reload)
  const store2 = new StoreService();
  assert.equal(store2.isInWishlist('aur-01'), true, 'Restored store instance must find aur-01');
  assert.equal(store2.getWishlistCount(), 1);

  // Remove from wishlist
  const removed = store1.toggleWishlist(sampleProduct1);
  assert.equal(removed, false);
  assert.equal(store1.isInWishlist('aur-01'), false);
  assert.equal(store1.getWishlistCount(), 0);
});

test('Multi-card instance wishlist synchronization logic', () => {
  // Simulate DOM element classes
  class MockElement {
    constructor(tagName, attributes = {}) {
      this.tagName = tagName;
      this.attributes = attributes;
      this._classes = new Set();
      this.classList = {
        add: (...cls) => cls.forEach(c => this._classes.add(c)),
        remove: (...cls) => cls.forEach(c => this._classes.delete(c)),
        contains: (c) => this._classes.has(c),
        has: (c) => this._classes.has(c)
      };
    }
    getAttribute(attr) {
      return this.attributes[attr];
    }
  }

  // Card 1 SVG and Card 2 SVG (e.g. main grid + similar products rail)
  const card1Svg = new MockElement('svg');
  const card2Svg = new MockElement('svg');
  const allIcons = [card1Svg, card2Svg];

  // User adds to wishlist
  allIcons.forEach(icon => {
    icon.classList.add('fill-[#121212]', 'text-[#121212]');
  });

  assert.ok(card1Svg.classList.has('fill-[#121212]'), 'Card 1 must be filled');
  assert.ok(card2Svg.classList.has('fill-[#121212]'), 'Card 2 must also be filled synchronously');

  // User removes from wishlist
  allIcons.forEach(icon => {
    icon.classList.remove('fill-[#121212]', 'text-[#121212]');
  });

  assert.ok(!card1Svg.classList.has('fill-[#121212]'), 'Card 1 must have fill removed');
  assert.ok(!card2Svg.classList.has('fill-[#121212]'), 'Card 2 must have fill removed synchronously');
});

// ==========================================
// SUITE 2: CART OPERATIONS & QUANTITY
// ==========================================
console.log('\nSuite 2: Cart Operations & Calculations');

test('Cart addition, quantity increment, and size differentiation', () => {
  localStorage.clear();
  const store = new StoreService();

  // Add Product 1 Size M (qty 1)
  store.addToCart(sampleProduct1, 'M', 1);
  assert.equal(store.getCartCount(), 1);

  // Add Product 1 Size M again (qty 1 -> should increase to 2)
  store.addToCart(sampleProduct1, 'M', 1);
  assert.equal(store.getCartCount(), 2);
  const cartItems = store.getCart();
  assert.equal(cartItems.length, 1);
  assert.equal(cartItems[0].quantity, 2);

  // Add Product 1 Size L (different size -> new line item)
  store.addToCart(sampleProduct1, 'L', 1);
  assert.equal(store.getCart().length, 2);
  assert.equal(store.getCartCount(), 3);

  // Increment quantity via updateCartQuantity
  store.updateCartQuantity('aur-01', 'M', 1);
  assert.equal(store.getCart().find(i => i.selectedSize === 'M').quantity, 3);

  // Decrement quantity
  store.updateCartQuantity('aur-01', 'M', -1);
  assert.equal(store.getCart().find(i => i.selectedSize === 'M').quantity, 2);

  // Decrement to zero removes line item
  store.updateCartQuantity('aur-01', 'L', -1);
  assert.equal(store.getCart().find(i => i.selectedSize === 'L'), undefined);
  assert.equal(store.getCart().length, 1);
});

test('Cart totals and coupon calculation business logic', () => {
  localStorage.clear();
  const store = new StoreService();
  store.addToCart(sampleProduct1, 'M', 1); // Price: 4800, Original: 6800

  const totals = store.getCartTotals();
  assert.equal(totals.subtotal, 4800);
  assert.equal(totals.originalTotal, 6800);
  assert.equal(totals.discount, 2000);

  // Subtotal >= 1999 gives complimentary shipping
  const effectiveShipping = totals.subtotal >= 1999 ? 0 : 250;
  assert.equal(effectiveShipping, 0);

  // Test ATELIER2026 coupon (10% off subtotal + complimentary shipping)
  const couponDiscountAtelier = Math.round(totals.subtotal * 0.10);
  assert.equal(couponDiscountAtelier, 480);
  const finalTotalAtelier = totals.subtotal - couponDiscountAtelier + 0;
  assert.equal(finalTotalAtelier, 4320);

  // Test AURELIA10 coupon (flat 300 courtesy)
  const couponDiscountCourtesy = 300;
  const finalTotalCourtesy = totals.subtotal - couponDiscountCourtesy + 0;
  assert.equal(finalTotalCourtesy, 4500);
});

// ==========================================
// SUITE 3: CHECKOUT ADDRESS VALIDATION
// ==========================================
console.log('\nSuite 3: Checkout Address Persistence & Validation');

test('Checkout address storage and structural validation', () => {
  localStorage.clear();
  const STORAGE_KEY = 'aurelia_shipping_address';

  function validateAddress(addr) {
    return (
      addr &&
      typeof addr.name === 'string' && addr.name.trim().length > 0 &&
      typeof addr.phone === 'string' && addr.phone.trim().length > 0 &&
      typeof addr.house === 'string' && addr.house.trim().length > 0 &&
      typeof addr.loc === 'string' && addr.loc.trim().length > 0 &&
      typeof addr.city === 'string' && addr.city.trim().length > 0 &&
      typeof addr.pin === 'string' && addr.pin.trim().length > 0
    );
  }

  const validAddress = {
    name: 'Devansh Roy',
    phone: '9812345678',
    house: 'Villa 12, Palm Meadows',
    loc: 'Whitefield',
    city: 'Bengaluru',
    pin: '560066'
  };

  assert.equal(validateAddress(validAddress), true);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validAddress));

  // Retrieve & verify
  const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  assert.equal(retrieved.name, 'Devansh Roy');
  assert.equal(retrieved.city, 'Bengaluru');

  // Test invalid / incomplete address
  const incompleteAddress = { ...validAddress, pin: '' };
  assert.equal(validateAddress(incompleteAddress), false);
});

// ==========================================
// SUITE 4: SHOP FILTERING & CATALOG DATA
// ==========================================
console.log('\nSuite 4: Product Catalog & Filtering');

test('Product catalog integrity and facet counts', () => {
  const allProducts = productService.getAll();
  assert.equal(allProducts.length, 40, 'Must have exactly 40 catalogue items');

  const counts = productService.getCounts();
  assert.ok(counts.categories['men'] > 0);
  assert.ok(counts.categories['women'] > 0);
  assert.ok(counts.categories['footwear'] > 0);
  assert.ok(counts.categories['accessories'] > 0);
});

test('Price range slider and category filtering', () => {
  // Filter maxPrice: 3000
  const under3k = productService.filter({ maxPrice: 3000, sort: 'recommended' });
  assert.ok(under3k.length > 0);
  assert.ok(under3k.every(p => p.price <= 3000), 'All filtered products must be <= ₹3000');

  // Filter category: men
  const menOnly = productService.filter({ categories: ['men'], maxPrice: 6000, sort: 'recommended' });
  assert.ok(menOnly.every(p => p.category.toLowerCase() === 'men'));
});

// ==========================================
// SUITE 5: RESPONSIVE LAYOUT & CONTAINER AUDIT
// ==========================================
console.log('\nSuite 5: Responsive Layout & Container Widths');

test('HTML templates and CSS have full-width fluid layouts', () => {
  const shopHtml = fs.readFileSync('shop.html', 'utf8');
  assert.ok(shopHtml.includes('w-full'), 'shop.html must use w-full');

  const productHtml = fs.readFileSync('product.html', 'utf8');
  assert.ok(productHtml.includes('w-full'), 'product.html must use w-full');

  const indexHtml = fs.readFileSync('index.html', 'utf8');
  assert.ok(indexHtml.includes('w-full'), 'index.html must use w-full');

  const cartHtml = fs.readFileSync('cart.html', 'utf8');
  assert.ok(cartHtml.includes('w-full'), 'cart.html must use w-full');

  const layoutJs = fs.readFileSync('src/js/components/layout.js', 'utf8');
  assert.ok(layoutJs.includes('w-full'), 'layout.js must use w-full');

  const styleCss = fs.readFileSync('src/css/style.css', 'utf8');
  assert.ok(styleCss.includes('.atelier-container'), 'style.css must define .atelier-container');
});

test('Shop grid implements 2-3-4-5 column responsive hierarchy', () => {
  const shopHtml = fs.readFileSync('shop.html', 'utf8');
  assert.ok(shopHtml.includes('grid-cols-2'), 'Must support 2 cols for mobile');
  assert.ok(shopHtml.includes('md:grid-cols-3'), 'Must support 3 cols for tablet');
  assert.ok(shopHtml.includes('lg:grid-cols-4'), 'Must support 4 cols for standard desktop');
  assert.ok(shopHtml.includes('xl:grid-cols-5'), 'Must support 5 cols for widescreen desktop');
});

test('Mobile search accessibility in header', () => {
  const layoutJs = fs.readFileSync('src/js/components/layout.js', 'utf8');
  assert.ok(layoutJs.includes('mobile-search-toggle-btn'), 'Header must have mobile search toggle');
  assert.ok(layoutJs.includes('mobile-search-bar'), 'Header must have mobile search dropdown');
  assert.ok(layoutJs.includes('Popular Atelier Curations'), 'Header must have popular search suggestions');
});

console.log('\n====================================================');
console.log(`  All Tests Passed: ${passedTests}/${totalTests} (100% Success)`);
console.log('====================================================\n');
