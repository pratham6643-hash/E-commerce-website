// Modern, lightweight Toast notification service (Native JS + Tailwind)
class ToastService {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    let existing = document.getElementById('toast-container');
    if (!existing) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(this.container);
    } else {
      this.container = existing;
    }
  }

  show(message, type = 'success') {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-md shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-[-10px] opacity-0 ${
      type === 'success'
        ? 'bg-white border-gray-200 text-gray-900 border-l-4 border-l-gray-900'
        : type === 'error'
        ? 'bg-white border-red-200 text-red-900 border-l-4 border-l-red-600'
        : 'bg-white border-gray-200 text-gray-700'
    }`;

    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full ${type === 'success' ? 'bg-gray-900' : 'bg-red-600'}"></span>
        <span>${message}</span>
      </div>
      <button class="text-gray-400 hover:text-gray-700 font-bold ml-2 text-base leading-none">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    this.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-[-10px]', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto dismiss after 3.2s
    setTimeout(() => {
      this.dismiss(toast);
    }, 3200);
  }

  dismiss(toast) {
    if (!toast || !toast.parentElement) return;
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-[-10px]');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  success(msg) {
    this.show(msg, 'success');
  }

  error(msg) {
    this.show(msg, 'error');
  }
}

export const toast = new ToastService();
