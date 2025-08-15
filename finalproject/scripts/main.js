// scripts/main.js
import { getExpenses, saveExpenses, getTheme, saveTheme } from './storage.js';
import { fetchFinancialData } from './api.js';


/* --- Helper to safely query elements --- */
const $ = (id) => document.getElementById(id);


/* --- Preload sample data if needed --- */
async function preloadSampleDataIfNeeded() {
    try {
        const current = getExpenses();
        if (!current || current.length < 15) {
            // try to fetch local sample data (optional)
            const resp = await fetch('data/sample-expenses.json');
            if (!resp.ok) throw new Error(`Failed to load sample data (${resp.status})`);
            const data = await resp.json();
            if (Array.isArray(data) && data.length) {
                saveExpenses(data);
                console.info('Sample expenses preloaded to localStorage.');
            }
        }
    } catch (err) {
        console.error('Preload sample data failed:', err);
        if (!getExpenses()) saveExpenses([]);
    }
}


/* --- Theme toggle --- */
function initThemeToggle() {
    const themeToggleBtn = $('theme-toggle');
    try {
        const saved = getTheme() || 'light';
        document.body.classList.toggle('dark-mode', saved === 'dark');
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('.icon');
            if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';
            themeToggleBtn.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-mode');
                saveTheme(isDark ? 'dark' : 'light');
                if (icon) icon.textContent = isDark ? '☀️' : '🌙';
            });
        }
    } catch (e) {
        console.error('Theme init failed', e);
    }
}


/* --- Mobile nav --- */
function initMobileNav() {
    const mobileMenuBtn = $('menu-toggle');
    const navList = $('nav');
    if (!mobileMenuBtn || !navList) return;
    mobileMenuBtn.addEventListener('click', () => {
        const expanded = navList.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', String(expanded));
    });
}


/* --- Modal handling --- */
function showExpenseModal(expense) {
    const modalBackdrop = $('modal-backdrop');
    const modalDetails = $('modal-details');
    if (!modalBackdrop || !modalDetails) return;
    modalDetails.innerHTML = `
    <p><strong>Amount:</strong> $${Number(expense.amount).toFixed(2)}</p>
    <p><strong>Category:</strong> ${escapeText(expense.category)}</p>
    <p><strong>Date:</strong> ${escapeText(expense.date)}</p>
    <p><strong>Description:</strong> ${escapeText(expense.description)}</p>
  `;
    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
}
function hideExpenseModal() {
    const modalBackdrop = $('modal-backdrop');
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
}


/* --- Escape text --- */
function escapeText(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}


/* --- Render recent expenses --- */
function renderRecentExpenses() {
    const expensesListEl = $('expenses-list');
    if (!expensesListEl) return;
    const expenses = getExpenses() || [];
    const recent = expenses.slice(-5).reverse();
    expensesListEl.innerHTML = '';
    recent.forEach((exp) => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
      <div class="expense-line">
        <div class="exp-desc">${escapeText(exp.description)}</div>
        <div class="exp-amt">$${Number(exp.amount).toFixed(2)}</div>
      </div>
      <div class="expense-meta">
        <span class="exp-cat">${escapeText(exp.category)}</span>
        <span class="exp-date">${escapeText(exp.date)}</span>
        <button class="view-details" aria-label="View details">Details</button>
      </div>
    `;
        const btn = li.querySelector('.view-details');
        if (btn) {
            btn.addEventListener('click', () => showExpenseModal(exp));
        }
        expensesListEl.appendChild(li);
    });
}


/* --- Category totals --- */
function computeCategoryTotals() {
    const expenses = getExpenses() || [];
    return expenses.reduce((acc, e) => {
        const c = e.category || 'Other';
        acc[c] = (acc[c] || 0) + Number(e.amount);
        return acc;
    }, {});
}


function renderCategoryTotals() {
    const categoryTotalsEl = $('category-totals');
    const topCategoryEl = $('top-category');
    if (!categoryTotalsEl || !topCategoryEl) return;
    const totals = computeCategoryTotals();
    const totalAll = Object.values(totals).reduce((s, v) => s + v, 0) || 0;
    categoryTotalsEl.innerHTML = '';
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    entries.forEach(([cat, amt]) => {
        const percent = totalAll ? Math.round((amt / totalAll) * 100) : 0;
        const div = document.createElement('div');
        div.className = 'category-row';
        div.innerHTML = `<strong>${escapeText(cat)}</strong> — $${Number(amt).toFixed(2)} <span class="muted">(${percent}%)</span>`;
        categoryTotalsEl.appendChild(div);
    });
    if (entries.length) {
        const [topCat, topAmt] = entries[0];
        topCategoryEl.innerHTML = `<strong>Top category:</strong> ${escapeText(topCat)} — $${Number(topAmt).toFixed(2)}`;
    } else {
        topCategoryEl.textContent = 'No expenses yet';
    }
}


/* --- Budget handling (use localStorage directly here) --- */
function getBudget() {
    try {
        const v = localStorage.getItem('rb_budget');
        return v ? parseFloat(v) : null;
    } catch (e) { return null; }
}
function saveBudget(val) {
    try { localStorage.setItem('rb_budget', String(val)); } catch (e) { console.error('Save budget failed', e); }
}


/* consolidated updateBudgetUI (single implementation) */
function updateBudgetUI() {
    try {
        const budgetBar = $('budget-bar');
        const budgetText = $('budget-text');
        const budget = (function () { const raw = localStorage.getItem('rb_budget'); return raw ? parseFloat(raw) : null; })();
        const expenses = getExpenses() || [];
        const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
        if (!budget || budget <= 0) {
            if (budgetText) budgetText.textContent = 'No budget set';
            if (budgetBar) { budgetBar.style.width = '0%'; budgetBar.style.background = '#ddd'; budgetBar.parentElement && budgetBar.parentElement.setAttribute('aria-valuenow', '0'); }
            return;
        }
        const percent = Math.min(100, Math.round((totalExpenses / budget) * 100));
        if (budgetBar) { budgetBar.style.width = `${percent}%`; budgetBar.parentElement && budgetBar.parentElement.setAttribute('aria-valuenow', String(percent)); }
        if (budgetText) budgetText.textContent = `You have spent $${totalExpenses.toFixed(2)} of $${budget.toFixed(2)} (${percent}%)`;
        if (budgetBar) budgetBar.style.background = percent >= 80 ? getComputedStyle(document.documentElement).getPropertyValue('--color-danger').trim() || '#a30000' : 'var(--color-teal)';
    } catch (e) {
        console.error('updateBudgetUI error', e);
    }
}


/* --- Charts (canvas-based, defensive checks) --- */
function renderPieChart() {
    const pieCanvas = $('spending-pie');
    if (!pieCanvas) return;
    const totals = computeCategoryTotals();
    const entries = Object.entries(totals);
    const ctx = pieCanvas.getContext('2d');
    if (!entries.length) {
        ctx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);
        ctx.fillStyle = '#666'; ctx.font = '16px sans-serif';
        ctx.fillText('No data', pieCanvas.width / 2 - 20, pieCanvas.height / 2);
        return;
    }
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const colors = ['#009e8d', '#ff8a80', '#ffd54f', '#4fc3f7', '#b39ddb', '#ffb74d', '#a5d6a7'];
    let start = 0;
    const cx = pieCanvas.width / 2;
    const cy = pieCanvas.height / 2;
    const radius = Math.min(cx, cy) - 10;
    ctx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);
    entries.forEach(([cat, amt], i) => {
        const slice = (amt / total) * (Math.PI * 2);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, radius, start, start + slice); ctx.closePath();
        ctx.fillStyle = colors[i % colors.length]; ctx.fill();
        start += slice;
    });
    // legend
    let lx = 10, ly = pieCanvas.height - 18;
    ctx.font = '12px sans-serif';
    entries.forEach(([cat, amt], i) => {
        ctx.fillStyle = colors[i % colors.length]; ctx.fillRect(lx, ly - 10, 12, 12);
        ctx.fillStyle = '#222'; ctx.fillText(`${cat} (${Math.round((amt / total) * 100)}%)`, lx + 18, ly);
        ly -= 18;
    });
}


function renderLineChart() {
    const lineCanvas = $('spending-line');
    if (!lineCanvas) return;
    const expenses = (getExpenses() || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const ctx = lineCanvas.getContext('2d');
    if (!expenses.length) {
        ctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        ctx.fillStyle = '#666'; ctx.font = '14px sans-serif'; ctx.fillText('No data', 20, 30);
        return;
    }
    const byDate = {};
    expenses.forEach(e => { const d = e.date || ''; if (!byDate[d]) byDate[d] = 0; byDate[d] += Number(e.amount); });
    const dates = Object.keys(byDate).sort();
    const values = dates.map(d => byDate[d]);
    const w = lineCanvas.width, h = lineCanvas.height, padding = 30;
    ctx.clearRect(0, 0, w, h);
    const maxVal = Math.max(...values) || 1;
    const xStep = (w - padding * 2) / Math.max(1, dates.length - 1);
    ctx.strokeStyle = '#ddd'; ctx.beginPath(); ctx.moveTo(padding, h - padding); ctx.lineTo(w - padding, h - padding); ctx.stroke();
    ctx.strokeStyle = 'var(--color-teal)'; ctx.lineWidth = 2; ctx.beginPath();
    values.forEach((v, i) => { const x = padding + i * xStep; const y = h - padding - (v / maxVal) * (h - padding * 2); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
    ctx.fillStyle = '#00786b';
    values.forEach((v, i) => { const x = padding + i * xStep; const y = h - padding - (v / maxVal) * (h - padding * 2); ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#333'; ctx.font = '10px sans-serif';
    dates.forEach((d, i) => { const x = padding + i * xStep; ctx.fillText(d.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3'), x - 12, h - 8); });
}


/* --- Balance rendering --- */
function renderBalance() {
    const el = $('current-balance');
    if (!el) return;
    const expenses = getExpenses() || [];
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const incomes = JSON.parse(localStorage.getItem('rb_incomes') || '[]');
    const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
    const balance = (totalIncome - totalExpenses) || 0;
    el.textContent = `$${balance.toFixed(2)}`;
    el.style.color = balance < 0 ? getComputedStyle(document.documentElement).getPropertyValue('--color-danger').trim() || '#ff6b6b' : 'var(--color-teal)';
    updateBudgetUI();
}


/* --- Income handling --- */
function initIncomeForm() {
    const incomeForm = $('income-form');
    if (!incomeForm) return;
    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amt = parseFloat($('income-amount').value) || 0;
        const desc = $('income-description').value || 'Income';
        try {
            const incomes = JSON.parse(localStorage.getItem('rb_incomes') || '[]');
            incomes.push({ amount: amt, description: desc, date: (new Date()).toISOString().slice(0, 10) });
            localStorage.setItem('rb_incomes', JSON.stringify(incomes));
            incomeForm.reset();
            renderBalance();
        } catch (err) {
            console.error('Save income failed', err);
        }
    });
}


/* --- Expense form handling --- */
function initExpenseForm() {
    const expenseForm = $('expense-form');
    if (!expenseForm) return;
    expenseForm.addEventListener('submit', (e) => {
        // we allow the GET navigation to occur; also save to localStorage
        const amount = parseFloat($('expense-amount').value) || 0;
        const category = $('expense-category').value || 'Other';
        const date = $('expense-date').value || (new Date()).toISOString().slice(0, 10);
        const description = $('expense-description').value || '';
        try {
            const arr = getExpenses() || [];
            arr.push({ amount, category, date, description });
            saveExpenses(arr);
            // local UI updates
            renderRecentExpenses();
            renderCategoryTotals();
            renderPieChart();
            renderLineChart();
            renderBalance();
        } catch (err) {
            console.error('Add expense failed', err);
        }
        // let browser continue to form-submission.html (method=get)
    });
}


/* --- Clear button --- */
function initClearButton() {
    const clearBtn = $('clear-expenses');
    if (!clearBtn) return;
    clearBtn.addEventListener('click', () => {
        if (!confirm('Clear all saved expenses?')) return;
        saveExpenses([]);
        renderRecentExpenses();
        renderCategoryTotals();
        renderPieChart();
        renderLineChart();
        renderBalance();
    });
}


/* --- Modal close handlers --- */
function initModalHandlers() {
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalBackdrop = $('modal-backdrop');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideExpenseModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) hideExpenseModal(); });
}


/* --- Fetch external API data --- */
async function initApiFetch() {
    try {
        if (typeof fetchFinancialData === 'function') {
            await fetchFinancialData();
        } else {
            const apiDisplay = $('api-data-display');
            if (apiDisplay) apiDisplay.textContent = 'Live data unavailable';
        }
    } catch (err) {
        console.error('fetchFinancialData failed', err);
        const apiDisplay = $('api-data-display');
        if (apiDisplay) apiDisplay.textContent = 'Error loading live data';
    }
}


/* --- Save budget button --- */
function initBudgetSave() {
    const saveBudgetBtn = $('save-budget');
    const budgetInput = $('budget-input');
    if (!saveBudgetBtn || !budgetInput) return;
    saveBudgetBtn.addEventListener('click', () => {
        const v = parseFloat(budgetInput.value);
        if (!isNaN(v) && v > 0) {
            saveBudget(v);
            updateBudgetUI();
        } else {
            alert('Enter a valid budget amount');
        }
    });
}


/* --- Initialize on DOMContentLoaded --- */
document.addEventListener('DOMContentLoaded', async () => {
    await preloadSampleDataIfNeeded();
    initThemeToggle();
    initMobileNav();
    initIncomeForm();
    initExpenseForm();
    initClearButton();
    initModalHandlers();
    initBudgetSave();

    

    // Render & fetch
    renderRecentExpenses();
    renderCategoryTotals();
    renderPieChart();
    renderLineChart();
    renderBalance();
    await initApiFetch();
});




