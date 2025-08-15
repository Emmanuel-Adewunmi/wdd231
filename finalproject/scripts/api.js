// scripts/api.js
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';


export const fetchFinancialData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Data:', data);
    displayFinancialData(data);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    const apiDisplay = document.getElementById('api-data-display');
    if (apiDisplay) {
      apiDisplay.innerHTML = '<p>Error loading exchange rates. Please try again later.</p>';
    }
  }
};


const displayFinancialData = (data) => {
  const apiDisplay = document.getElementById('api-data-display');
  if (apiDisplay) {
    const currencies = data.rates;
    const targetCurrencies = ['NGN', 'EUR', 'GBP', 'JPY'];


    let html = '<h3>Exchange Rates (1 USD)</h3><ul>';
    targetCurrencies.forEach(currency => {
      if (currencies[currency]) {
        html += `<li><strong>${currency}:</strong> ${currencies[currency].toFixed(2)}</li>`;
      }
    });
    html += '</ul>';
    apiDisplay.innerHTML = html;
  }
};




