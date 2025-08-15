document.addEventListener('DOMContentLoaded', () => {

    const cardGrid = document.getElementById('card-grid');

    async function fetchBusinesses() {
        try {
            const response = await fetch('./data/discover.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const businesses = await response.json();
            displayBusinesses(businesses);
        } catch (error) {
            console.error('Could not fetch business data:', error);
            cardGrid.innerHTML = '<p>Sorry, we could not load the business directory at this time.</p>';
        }
    }

    function displayBusinesses(businesses) {
        cardGrid.innerHTML = '';
        businesses.forEach(business => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <h2>${business.name}</h2>
                <figure>
                    <img src="${business.image}" alt="${business.name} image" loading="lazy">
                </figure>
                <address>${business.address}</address>
                <p>${business.description}</p>
                <a href="${business.website}" class="learn-more-button" target="_blank" rel="noopener">
                    Learn more about ${business.name}
                </a>
            `;
            cardGrid.appendChild(card);
        });
    }

    // --- Local Storage for Visit Message ---
    const visitMessage = document.getElementById('visit-message');
    const lastVisit = Number(localStorage.getItem('lastVisit'));
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    if (!lastVisit) {
        visitMessage.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
        const timeDifference = now - lastVisit;
        const daysDifference = Math.floor(timeDifference / ONE_DAY_MS);

        if (daysDifference < 1) {
            visitMessage.textContent = 'Back so soon! Awesome!';
        } else if (daysDifference === 1) {
            visitMessage.textContent = 'You last visited 1 day ago.';
        } else {
            visitMessage.textContent = `You last visited ${daysDifference} days ago.`;
        }
    }

    localStorage.setItem('lastVisit', now);

    fetchBusinesses();
});
