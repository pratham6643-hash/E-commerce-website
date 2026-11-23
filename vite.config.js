import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        shop: fileURLToPath(new URL('./shop.html', import.meta.url)),
        product: fileURLToPath(new URL('./product.html', import.meta.url)),
        cart: fileURLToPath(new URL('./cart.html', import.meta.url)),
        wishlist: fileURLToPath(new URL('./wishlist.html', import.meta.url)),
        checkout: fileURLToPath(new URL('./checkout.html', import.meta.url)),
        login: fileURLToPath(new URL('./login.html', import.meta.url)),
        signup: fileURLToPath(new URL('./signup.html', import.meta.url)),
        help: fileURLToPath(new URL('./help.html', import.meta.url)),
        account: fileURLToPath(new URL('./account.html', import.meta.url)),
      },
    },
  },
});
