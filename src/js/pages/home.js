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
    // Enhanced touch interactions for mobile
    grabCursor: true,
    touchRatio: 1,
    threshold: 8,
    resistance: true,
    resistanceRatio: 0.85,
    touchAngle: 45,
  });

  // Render Trending Products (first 4 items)
  const trendingContainer = document.getElementById('trending-products');
  const allTrending = productService.getTrending();
  const trendingItems = allTrending.slice(0, 4);
  const trendingIds = new Set(trendingItems.map((p) => p.id));

  if (trendingContainer) {
    trendingContainer.innerHTML = trendingItems.map(createProductCard).join('');
    bindProductCardEvents(trendingContainer, trendingItems);
  }

  // Render Featured Curations (distinct items not in Trending to avoid duplication)
  const featuredContainer = document.getElementById('featured-products');
  let featuredItems = productService.getFeatured().filter((p) => !trendingIds.has(p.id));
  if (featuredItems.length < 4) {
    const remaining = productService.getAll().filter((p) => !trendingIds.has(p.id) && !featuredItems.some(f => f.id === p.id));
    featuredItems = [...featuredItems, ...remaining].slice(0, 4);
  }

  if (featuredContainer) {
    featuredContainer.innerHTML = featuredItems.map(createProductCard).join('');
    bindProductCardEvents(featuredContainer, featuredItems);
  }

  // Subtle Editorial Animations (Respects prefers-reduced-motion)
  if (!prefersReducedMotion()) {
    initHomeAnimations();
  }

  // Refresh ScrollTrigger after DOM rendering
  ScrollTrigger.refresh();

  createIcons({ icons });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else {
  initHome();
}

function initHomeAnimations() {
  // Stagger reveal for Trending Product cards
  const trendingGrid = document.getElementById('trending-products');
  if (trendingGrid && trendingGrid.children.length > 0) {
    gsap.fromTo(trendingGrid.children,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trendingGrid,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  // Stagger reveal for Featured Curations
  const featuredGrid = document.getElementById('featured-products');
  if (featuredGrid && featuredGrid.children.length > 0) {
    gsap.fromTo(featuredGrid.children,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuredGrid,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }
}
