// scripts/history.js
import { getExpenses, getTheme, saveTheme } from './storage.js';


// DOM Elements
const expensesList = document.getElementById('expenses-history-list');
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('nav');
const themeToggle = document.getElementById('theme-toggle');


const applyTheme = (theme) => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    saveTheme(theme);
    updateThemeIcon(theme);
};


const updateThemeIcon = (theme) => {
    const iconSpan = themeToggle?.querySelector('.icon');
    if (iconSpan) {
        iconSpan.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Toggle Dark Mode' : 'Toggle Light Mode');
    }
};


const renderAllExpenses = () => {
    if (!expensesList) return;
    const expenses = getExpenses() || [];
    expensesList.innerHTML = '';
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
      <span>${expense.description}</span>
      <span>$${Number(expense.amount).toFixed(2)}</span>
      <span>${expense.category}</span>
      <span>${expense.date}</span>
    `;
        expensesList.appendChild(li);
    });
};


document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getTheme() || 'light';
    applyTheme(savedTheme);


    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        });
    }


    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = getTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }


    renderAllExpenses();


    // footer year/last modified
    const yearEl = document.getElementById('currentyear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    const lastModEl = document.getElementById('lastModified');
    if (lastModEl) lastModEl.textContent = 'Last modified: ' + document.lastModified;
});
