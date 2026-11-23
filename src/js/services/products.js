// Centralized Product Service
import productsData from '../../data/products.json' with { type: 'json' };

class ProductService {
  constructor() {
    this.products = productsData;
  }

  getAll() {
    return this.products;
  }

  getById(id) {
    return this.products.find((p) => p.id === id);
  }

  getFeatured() {
    return this.products.filter((p) => p.isFeatured);
  }

  getTrending() {
    return this.products.filter((p) => p.isTrending);
  }

  // Calculate dynamic facet counts based on current full catalog
  getCounts() {
    const categories = {};
    const subcategories = {};
    const brands = {};
    const sizes = {};
    const discounts = {
      40: 0,
      30: 0,
      20: 0,
    };
    const ratings = {
      4.5: 0,
      4.0: 0,
    };
    const priceBuckets = {
      'under-2500': 0,
      '2500-3500': 0,
      'above-3500': 0,
    };

    this.products.forEach((p) => {
      // Categories
      const cat = p.category ? p.category.toLowerCase() : 'other';
      categories[cat] = (categories[cat] || 0) + 1;

      // Subcategories
      if (p.subcategory) {
        const sub = p.subcategory.toLowerCase();
        subcategories[sub] = (subcategories[sub] || 0) + 1;
      }

      // Brands
      if (p.brand) {
        brands[p.brand] = (brands[p.brand] || 0) + 1;
      }

      // Sizes
      if (p.sizes && Array.isArray(p.sizes)) {
        p.sizes.forEach((s) => {
          sizes[s] = (sizes[s] || 0) + 1;
        });
      }

      // Price buckets
      if (p.price < 2500) priceBuckets['under-2500']++;
      else if (p.price <= 3500) priceBuckets['2500-3500']++;
      else priceBuckets['above-3500']++;

      // Discounts
      const disc = p.discountPercent || 0;
      if (disc >= 40) discounts[40]++;
      if (disc >= 30) discounts[30]++;
      if (disc >= 20) discounts[20]++;

      // Ratings
      const rat = p.rating || 0;
      if (rat >= 4.5) ratings[4.5]++;
      if (rat >= 4.0) ratings[4.0]++;
    });

    return {
      total: this.products.length,
      categories,
      subcategories,
      brands,
      sizes,
      priceBuckets,
      discounts,
      ratings,
    };
  }

  // Advanced multi-faceted filtering
  filter({
    categories = [],
    category = '', // For backwards compatibility
    subcategories = [],
    brands = [],
    sizes = [],
    priceBuckets = [],
    maxPrice = null,
    minDiscount = 0,
    minRating = 0,
    sort = 'recommended',
    query = '',
  }) {
    let result = [...this.products];

    // Normalize category list
    let catList = Array.isArray(categories) ? [...categories] : [];
    if (category && category !== 'all' && !catList.includes(category.toLowerCase())) {
      catList.push(category.toLowerCase());
    }
    catList = catList.map((c) => c.toLowerCase()).filter(Boolean);

    // Filter by categories (OR within categories)
    if (catList.length > 0 && !catList.includes('all')) {
      result = result.filter((p) => catList.includes(p.category.toLowerCase()));
    }

    // Filter by subcategories
    if (subcategories.length > 0) {
      result = result.filter(
        (p) => p.subcategory && subcategories.includes(p.subcategory.toLowerCase())
      );
    }

    // Filter by brands (OR within brands)
    if (brands.length > 0) {
      result = result.filter((p) => brands.includes(p.brand));
    }

    // Filter by sizes (OR within sizes)
    if (sizes.length > 0) {
      result = result.filter((p) => p.sizes && p.sizes.some((s) => sizes.includes(s)));
    }

    // Filter by price buckets (OR within selected buckets)
    if (priceBuckets.length > 0) {
      result = result.filter((p) => {
        return priceBuckets.some((bucket) => {
          if (bucket === 'under-2500') return p.price < 2500;
          if (bucket === '2500-3500') return p.price >= 2500 && p.price <= 3500;
          if (bucket === 'above-3500') return p.price > 3500;
          return true;
        });
      });
    }

    // Filter by max price slider
    if (maxPrice !== null && !isNaN(maxPrice)) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Filter by discount
    if (minDiscount > 0) {
      result = result.filter((p) => (p.discountPercent || 0) >= minDiscount);
    }

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= minRating);
    }

    // Filter by search query
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sort) {
      if (sort === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'discount') {
        result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      } else if (sort === 'newest') {
        result.sort((a, b) => b.id.localeCompare(a.id));
      } else if (sort === 'recommended' || sort === 'popular') {
        // Stable order favoring featured and trending items
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }
    }

    return result;
  }
}

export const productService = new ProductService();
