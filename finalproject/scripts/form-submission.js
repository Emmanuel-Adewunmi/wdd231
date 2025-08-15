// scripts/form-submission.js
import { getTheme, saveTheme } from './storage.js';


// Footer Year & Last Modified
(function () {
  const yearEl = document.getElementById('currentyear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const lastModEl = document.getElementById('lastModified');
  if (lastModEl) lastModEl.textContent = 'Last modified: ' + document.lastModified;
})();


// Theme Toggle & init
(function () {
  const themeToggleBtn = document.getElementById('theme-toggle');


  const savedTheme = getTheme() || 'light';
  document.body.classList.toggle('dark-mode', savedTheme === 'dark');
  updateThemeIcon(savedTheme);


  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      const newTheme = isDark ? 'dark' : 'light';
      saveTheme(newTheme);
      updateThemeIcon(newTheme);
    });
  }


  function updateThemeIcon(theme) {
    const iconSpan = themeToggleBtn?.querySelector('.icon');
    if (iconSpan) iconSpan.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
})();


// Mobile Navigation
(function () {
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = nav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', expanded);
    });
  }
})();


// Display Form Submission Data
(function () {
  const params = new URLSearchParams(window.location.search);
  const paramsList = document.getElementById('params-list');
  const rawQuery = document.getElementById('raw-query');
  const noParams = document.getElementById('no-params');


  if (!params || Array.from(params.keys()).length === 0) {
    if (noParams) noParams.hidden = false;
    if (rawQuery) rawQuery.textContent = window.location.search || '(empty)';
    return;
  }


  if (noParams) noParams.hidden = true;


  const keyNames = {
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    description: 'Description',
    'expense-amount': 'Amount',
    'expense-category': 'Category',
    'expense-date': 'Date',
    'expense-description': 'Description'
  };


  if (!paramsList) return;
  paramsList.innerHTML = '';
  for (const [key, value] of params.entries()) {
    const displayKey = keyNames[key] || key;
    const dt = document.createElement('dt');
    dt.textContent = displayKey;
    const dd = document.createElement('dd');
    const decoded = decodeURIComponent(value || '').trim();
    dd.textContent = decoded === '' ? '(no value)' : decoded;
    paramsList.appendChild(dt);
    paramsList.appendChild(dd);
  }


  if (rawQuery) rawQuery.textContent = window.location.search || '(empty)';
})();


