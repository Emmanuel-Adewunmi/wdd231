// scripts/storage.js


export const saveTheme = (theme) => {
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error('Failed to save theme to local storage:', error);
    }
};


export const getTheme = () => {
    try {
        return localStorage.getItem('theme');
    } catch (error) {
        console.error('Failed to get theme from local storage:', error);
        return null;
    }
};


export const saveExpenses = (expenses) => {
    try {
        const expensesJSON = JSON.stringify(expenses);
        localStorage.setItem('expenses', expensesJSON);
    } catch (error) {
        console.error('Failed to save expenses to local storage:', error);
    }
};


export const getExpenses = () => {
    try {
        const expensesJSON = localStorage.getItem('expenses');
        return expensesJSON ? JSON.parse(expensesJSON) : [];
    } catch (error) {
        console.error('Failed to get expenses from local storage:', error);
        return [];
    }
};




