// Centralized Frontend Store (LocalStorage for Cart & Wishlist with Safe Migration)
const CART_KEY = 'aurelia_cart_items';
const WISHLIST_KEY = 'aurelia_wishlist_items';
const LEGACY_CART_KEY = 'ajio_cart_items';
const LEGACY_WISHLIST_KEY = 'ajio_wishlist_items';

class StoreService {
  constructor() {
    this.cart = this.loadWithMigration(CART_KEY, LEGACY_CART_KEY, []);
    this.wishlist = this.loadWithMigration(WISHLIST_KEY, LEGACY_WISHLIST_KEY, []);
  }

  /**
   * Safely loads data from modern AURELIA key first.
   * If missing, checks legacy AJIO key, migrates data to modern key, and persists.
   */
  loadWithMigration(modernKey, legacyKey, fallback) {
    try {
      const modernData = localStorage.getItem(modernKey);
      if (modernData) {
        return JSON.parse(modernData);
      }

      // Safe legacy migration fallback
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        // Save under modern key so future reads are instantaneous
        localStorage.setItem(modernKey, JSON.stringify(parsed));
        return parsed;
      }

      return fallback;
    } catch (e) {
      console.warn(`LocalStorage access failed for ${modernKey}:`, e);
      return fallback;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.dispatchChange();
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  dispatchChange() {
    window.dispatchEvent(new CustomEvent('app:state-changed', {
      detail: {
        cartCount: this.getCartCount(),
        wishlistCount: this.getWishlistCount(),
      }
    }));
  }

  // --- Cart Operations ---
  getCart() {
    return this.cart;
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(product, size = 'M', quantity = 1) {
    const existingIndex = this.cart.findIndex(
      (item) => item.id === product.id && item.selectedSize === size
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        image: product.images ? product.images[0] : product.image,
        selectedSize: size,
        quantity: quantity,
      });
    }

    this.saveToStorage(CART_KEY, this.cart);
  }

  removeFromCart(id, size) {
    this.cart = this.cart.filter(
      (item) => !(item.id === id && item.selectedSize === size)
    );
    this.saveToStorage(CART_KEY, this.cart);
  }

  updateCartQuantity(id, size, delta) {
    const item = this.cart.find(
      (item) => item.id === id && item.selectedSize === size
    );
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(id, size);
    } else {
      this.saveToStorage(CART_KEY, this.cart);
    }
  }

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const originalTotal = this.cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const discount = originalTotal - subtotal;
    const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 199;
    const total = subtotal + shipping;

    return { subtotal, originalTotal, discount, shipping, total };
  }

  clearCart() {
    this.cart = [];
    this.saveToStorage(CART_KEY, this.cart);
  }

  // --- Wishlist Operations ---
  getWishlist() {
    return this.wishlist;
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  isInWishlist(id) {
    return this.wishlist.some((item) => item.id === id);
  }

  addToWishlist(product) {
    if (!this.isInWishlist(product.id)) {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        image: product.images ? product.images[0] : (product.image || ''),
      });
      this.saveToStorage(WISHLIST_KEY, this.wishlist);
    }
  }

  toggleWishlist(product) {
    const index = this.wishlist.findIndex((item) => item.id === product.id);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        image: product.images ? product.images[0] : product.image,
      });
      added = true;
    }
    this.saveToStorage(WISHLIST_KEY, this.wishlist);
    return added;
  }

  removeFromWishlist(id) {
    this.wishlist = this.wishlist.filter((item) => item.id !== id);
    this.saveToStorage(WISHLIST_KEY, this.wishlist);
  }
}

export const store = new StoreService();
