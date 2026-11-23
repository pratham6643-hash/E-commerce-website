import { initLayout } from '../components/layout.js';
import { productService } from '../services/products.js';
import { createProductCard, bindProductCardEvents } from '../components/product-card.js';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../utils/motion.js';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { createIcons, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide';

const icons = { ArrowRight, ChevronLeft, ChevronRight, Sparkles };

function initHome() {
  initLayout('home');

  // Initialize Swiper Hero Banner
  const heroSwiper = new Swiper('.hero-swiper', {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.hero-nav-next',
      prevEl: '.hero-nav-prev',
      addIcons: false,
    },
    grabCursor: true,
    touchRatio: 1,
    threshold: 8,
    resistance: true,
    resistanceRatio: 0.85,
    touchAngle: 45,
  });

  const allProducts = productService.getAll();

  // Helper to populate and bind product container
  function renderSection(containerId, items) {
    const container = document.getElementById(containerId);
    if (container && items && items.length > 0) {
      container.innerHTML = items.map(createProductCard).join('');
      bindProductCardEvents(container, items);
    }
  }

  // 1. Trending in Men (5 items on desktop)
  const menItems = allProducts.filter((p) => p.category && p.category.toLowerCase() === 'men').slice(0, 5);
  renderSection('trending-men', menItems);

  // 2. Trending in Women (5 items on desktop)
  const womenItems = allProducts.filter((p) => p.category && p.category.toLowerCase() === 'women').slice(0, 5);
  renderSection('trending-women', womenItems);

  // 3. Best Sellers (5 items on desktop)
  const bestSellers = [...allProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  renderSection('best-sellers', bestSellers);

  // 4. New Season Arrivals (5 items on desktop)
  const newArrivals = [...allProducts].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);
  renderSection('new-arrivals', newArrivals);

  // 5. Footwear & Accessories (5 items on desktop)
  const footwearItems = allProducts.filter((p) => p.category && (p.category.toLowerCase() === 'footwear' || p.category.toLowerCase() === 'accessories')).slice(0, 5);
  renderSection('trending-footwear', footwearItems);

  // Backwards compatibility for existing legacy hooks
  const legacyTrending = productService.getTrending().slice(0, 4);
  renderSection('trending-products', legacyTrending);
  const legacyFeatured = productService.getFeatured().slice(0, 4);
  renderSection('featured-products', legacyFeatured);

  // Refresh ScrollTrigger after DOM rendering
  ScrollTrigger.refresh();

  createIcons({ icons });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else {
  initHome();
}
