import { initLayout } from '../components/layout.js';
import { toast } from '../components/toast.js';
import { createIcons, Eye, EyeOff, ShieldCheck, CheckCircle2, User, ArrowRight } from 'lucide';

const icons = { Eye, EyeOff, ShieldCheck, CheckCircle2, User, ArrowRight };

document.addEventListener('DOMContentLoaded', () => {
  initLayout('auth');

  // Login Form Demo
  const loginForm = document.getElementById('login-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const toggleLoginPassBtn = document.getElementById('toggle-login-password');
  const demoFillLoginBtn = document.getElementById('demo-fill-login');

  if (toggleLoginPassBtn && loginPassword) {
    toggleLoginPassBtn.addEventListener('click', () => {
      const isPass = loginPassword.type === 'password';
      loginPassword.type = isPass ? 'text' : 'password';
      toggleLoginPassBtn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
      createIcons({ icons });
    });
  }

  if (demoFillLoginBtn && loginEmail && loginPassword) {
    demoFillLoginBtn.addEventListener('click', () => {
      loginEmail.value = 'member@aurelia.com';
      loginPassword.value = 'atelier2026';
      toast.show('Demo credentials filled');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail ? loginEmail.value.trim() : '';
      const pass = loginPassword ? loginPassword.value.trim() : '';

      if (!email || !pass) {
        toast.show('Please provide both client identifier and passcode');
        return;
      }

      toast.success(`Welcome to AURELIA Atelier! Signed in as ${email}`);
      setTimeout(() => {
        window.location.href = '/shop.html';
      }, 900);
    });
  }

  // Signup Form Demo
  const signupForm = document.getElementById('signup-form');
  const signupName = document.getElementById('signup-name');
  const signupEmail = document.getElementById('signup-email');
  const signupPassword = document.getElementById('signup-password');
  const toggleSignupPassBtn = document.getElementById('toggle-signup-password');
  const demoFillSignupBtn = document.getElementById('demo-fill-signup');

  if (toggleSignupPassBtn && signupPassword) {
    toggleSignupPassBtn.addEventListener('click', () => {
      const isPass = signupPassword.type === 'password';
      signupPassword.type = isPass ? 'text' : 'password';
      toggleSignupPassBtn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
      createIcons({ icons });
    });
  }

  if (demoFillSignupBtn && signupName && signupEmail && signupPassword) {
    demoFillSignupBtn.addEventListener('click', () => {
      signupName.value = 'Aarav Mehta';
      signupEmail.value = 'aarav@domain.com';
      signupPassword.value = 'AtelierSecure@2026';
      toast.show('Demo registration profile filled');
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupName ? signupName.value.trim() : '';
      const email = signupEmail ? signupEmail.value.trim() : '';
      const pass = signupPassword ? signupPassword.value.trim() : '';

      if (!name || !email || !pass) {
        toast.show('Please complete all membership fields');
        return;
      }

      toast.success(`Atelier membership registered for ${name}!`);
      setTimeout(() => {
        window.location.href = '/shop.html';
      }, 900);
    });
  }

  createIcons({ icons });
});
