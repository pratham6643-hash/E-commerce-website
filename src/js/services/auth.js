// Centralized Frontend Authentication Service (Demo Simulation)
const AUTH_KEY = 'aurelia_auth_user';

export const authService = {
  /**
   * Returns current authenticated user object or null if logged out.
   */
  getUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.email) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Check if customer is currently logged in.
   */
  isLoggedIn() {
    return this.getUser() !== null;
  },

  /**
   * Log in user with demo credentials and dispatch change event.
   */
  login(userData = {}) {
    const defaultUser = {
      name: 'Arjun Singhania',
      email: 'member@aurelia.com',
      phone: '9876543210',
      gender: 'Male',
      dob: '1994-08-15',
      memberSince: '2026',
    };

    const user = {
      ...defaultUser,
      ...userData,
    };

    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage auth save failed:', e);
    }

    this.dispatchState(true, user);
    return user;
  },

  /**
   * Update profile information and persist.
   */
  updateProfile(updates = {}) {
    const current = this.getUser() || {
      name: 'Arjun Singhania',
      email: 'member@aurelia.com',
      phone: '9876543210',
      gender: 'Male',
      dob: '1994-08-15',
      memberSince: '2026',
    };

    const updated = {
      ...current,
      ...updates,
    };

    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage auth update failed:', e);
    }

    this.dispatchState(true, updated);
    return updated;
  },

  /**
   * Log out current user (preserves cart, wishlist and saved addresses).
   */
  logout() {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.warn('LocalStorage auth remove failed:', e);
    }

    this.dispatchState(false, null);
  },

  /**
   * Broadcast authentication state changes across layout components.
   */
  dispatchState(isLoggedIn, user) {
    window.dispatchEvent(
      new CustomEvent('auth:state-changed', {
        detail: { isLoggedIn, user },
      })
    );
  },
};
