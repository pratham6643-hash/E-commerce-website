import { initLayout } from '../components/layout.js';
import { toast } from '../components/toast.js';
import { createIcons, ChevronRight, ChevronDown, CheckCircle2, Package, HelpCircle } from 'lucide';

const icons = { ChevronRight, ChevronDown, CheckCircle2, Package, HelpCircle };

const helpTopics = {
  orders: {
    title: 'Order Related Queries',
    items: [
      {
        q: 'How do I track my order delivery?',
        a: 'You can track the live dispatch status of your order anytime by clicking the "MY ORDERS" button at the top of this page or selecting "My Orders" from your Profile dropdown. All orders include simulated courier tracking and real-time transit updates.'
      },
      {
        q: 'Can I cancel or modify items in my order?',
        a: 'Orders can be cancelled free of charge prior to warehouse dispatch (within 4 hours of placement). Once dispatched, you may decline the delivery or opt for our doorstep exchange service.'
      },
      {
        q: 'What is the return and exchange window?',
        a: 'AURELIA Atelier offers a 14-day hassle-free return and doorstep size exchange window on all unworn items with original security tags and designer packaging intact.'
      },
      {
        q: 'How does doorstep size exchange work?',
        a: 'If a garment requires a different size, initiate a size exchange request. A courier representative will deliver your replacement size while collecting the original piece at your doorstep simultaneously.'
      }
    ]
  },
  'non-orders': {
    title: 'Non-order Related Issues',
    items: [
      {
        q: 'How do I apply coupon codes at checkout?',
        a: 'You can enter active privilege codes (e.g., ATELIER2026 for 10% off + free delivery, or AURELIA10 for ₹300 off) in your Shopping Bag or at Checkout in the "Apply Coupon" section.'
      },
      {
        q: 'What payment methods are supported?',
        a: 'We support all major Indian payment methods in simulated demo mode: Unified UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking across top banks, and Cash on Delivery (COD).'
      },
      {
        q: 'Is Cash on Delivery (COD) available for my area?',
        a: 'Yes, Cash on Delivery is available for eligible pincodes across India on boutique orders up to ₹25,000. You can check availability on any product detail page.'
      },
      {
        q: 'How do I update my saved delivery address?',
        a: 'Navigate to your Profile dropdown and select "Saved Addresses", or modify your address directly during Step 2 of the checkout flow. All updates are instantly remembered.'
      }
    ]
  },
  recent: {
    title: 'Recent Issues & Updates',
    items: [
      {
        q: 'Festive season dispatch updates',
        a: 'Due to elevated seasonal demand, standard dispatch timelines may take 2 to 4 business days. Express courier lines remain fully operational with daily tracking updates.'
      },
      {
        q: 'Refund timeline for cancelled orders (Demo simulation)',
        a: 'UPI and net banking refunds are credited within 24 to 48 hours following order cancellation. Card refunds reflect within 3 to 5 banking days.'
      },
      {
        q: 'WhatsApp & SMS notifications',
        a: 'Automated order confirmations and dispatch milestones are simulated directly on-screen and preserved in your local browser session.'
      }
    ]
  },
  faqs: {
    title: 'Frequently Asked Questions',
    items: [
      {
        q: 'Are all products 100% authentic?',
        a: 'Yes. Every garment, accessory, and footwear item at AURELIA Atelier is crafted with verified premium textiles (Belgian linen, Italian calfskin, Toyoda selvedge denim, 925 sterling silver) with authentic provenance guarantees.'
      },
      {
        q: 'How does the 14-day return guarantee operate?',
        a: 'Simply raise a return request via your orders dossier. Our logistics partner will schedule a complimentary pickup from your saved delivery address.'
      },
      {
        q: 'How do I redeem Atelier Privilege gift cards?',
        a: 'Select "Gift Cards" from the Profile dropdown to check your card balance (e.g. demo code ATELIER-GIFT-5000), or enter the 16-digit voucher code during bag settlement.'
      },
      {
        q: 'How can I contact concierge support directly?',
        a: 'You can email our customer desk at care@aurelia.com, call our toll-free helpline at 1800-202-6000 (Mon-Sat, 9 AM - 8 PM IST), or use the message form below.'
      }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initLayout('help');

  const categoryTitle = document.getElementById('category-title');
  const accordionContainer = document.getElementById('faq-accordion-container');
  const categoryButtons = document.querySelectorAll('.help-category-btn');
  const ordersCtaBtn = document.getElementById('help-orders-cta-btn');
  const ticketForm = document.getElementById('help-ticket-form');

  let activeCategory = 'orders';

  function renderCategory(catKey) {
    activeCategory = catKey;
    const catData = helpTopics[catKey] || helpTopics.orders;

    if (categoryTitle) categoryTitle.textContent = catData.title;

    categoryButtons.forEach((btn) => {
      const isSelected = btn.dataset.category === catKey;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isSelected) {
        btn.classList.add('bg-[#121212]', 'text-white');
        btn.classList.remove('bg-transparent', 'text-[#535766]', 'hover:bg-gray-50');
        const icon = btn.querySelector('svg, i');
        if (icon) icon.classList.add('text-white');
      } else {
        btn.classList.remove('bg-[#121212]', 'text-white');
        btn.classList.add('bg-transparent', 'text-[#535766]', 'hover:bg-gray-50');
        const icon = btn.querySelector('svg, i');
        if (icon) icon.classList.remove('text-white');
      }
    });

    if (accordionContainer) {
      accordionContainer.innerHTML = catData.items.map((item, idx) => `
        <div class="faq-item py-4">
          <button 
            type="button" 
            class="faq-toggle-btn w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#121212] hover:text-[#c25e40] transition cursor-pointer py-1"
            aria-expanded="${idx === 0 ? 'true' : 'false'}"
          >
            <span>${item.q}</span>
            <i data-lucide="${idx === 0 ? 'chevron-down' : 'chevron-right'}" class="faq-icon w-4 h-4 text-[#737373] shrink-0 ml-3 transition-transform"></i>
          </button>
          <div class="faq-answer-content ${idx === 0 ? '' : 'hidden'} text-xs text-[#525252] leading-relaxed pt-2.5 font-light pr-4">
            ${item.a}
          </div>
        </div>
      `).join('');

      createIcons({ icons });

      // Accordion toggle click handlers
      accordionContainer.querySelectorAll('.faq-toggle-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const answer = item.querySelector('.faq-answer-content');
          const isExpanded = btn.getAttribute('aria-expanded') === 'true';

          // Toggle this item
          btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
          answer.classList.toggle('hidden', isExpanded);
          const icon = btn.querySelector('.faq-icon');
          if (icon) {
            icon.setAttribute('data-lucide', isExpanded ? 'chevron-right' : 'chevron-down');
          }
          createIcons({ icons });
        });
      });
    }
  }

  // Bind category switcher tabs
  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      renderCategory(btn.dataset.category);
    });
  });

  // Top Action: MY ORDERS Button
  if (ordersCtaBtn) {
    ordersCtaBtn.addEventListener('click', () => {
      // Trigger the profile modal for orders
      const profileBtn = document.getElementById('profile-btn');
      if (profileBtn) {
        // Find profile action button with data-action="orders"
        const ordersActionBtn = document.querySelector('.profile-action-btn[data-action="orders"]');
        if (ordersActionBtn) {
          ordersActionBtn.click();
        } else {
          toast.show('Opening active demo order details...');
        }
      }
    });
  }

  // Help Ticket Form Submit
  if (ticketForm) {
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ticket-name').value.trim();
      const topic = document.getElementById('ticket-topic').value;
      const message = document.getElementById('ticket-message').value.trim();

      if (!name || !message) {
        toast.show('Please provide all query details');
        return;
      }

      const ticketId = `HD-${Math.floor(1000 + Math.random() * 9000)}`;
      toast.success(`Query submitted successfully! Ticket Reference: #${ticketId}`);
      document.getElementById('ticket-message').value = '';
    });
  }

  // Initial render
  renderCategory('orders');
});
