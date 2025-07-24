// ================== WEATHER SECTION ==================
const weatherApiKey = "25e73c2a4b1d953c7ae045390f4bbfc9";
const city = "Lagos";
const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;

async function fetchWeather() {
    try {
        const response = await fetch(weatherURL);
        if (!response.ok) throw new Error("Weather data not available");
        const data = await response.json();

        const current = data.list[0];
        document.getElementById("current-temp").textContent = `Temperature: ${current.main.temp.toFixed(1)}°C`;
        document.getElementById("current-description").textContent = `Condition: ${current.weather[0].description}`;

        const forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "<h3>3-Day Forecast</h3>";
        for (let i = 8; i <= 24; i += 8) {
            const day = data.list[i];
            const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
            forecastDiv.innerHTML += `<p><strong>${date}:</strong> ${day.main.temp.toFixed(1)}°C, ${day.weather[0].description}</p>`;
        }
    } catch (error) {
        document.getElementById("weather").innerHTML = "<p>Unable to load weather data.</p>";
        console.error(error);
    }
}
fetchWeather();

// ================== SPOTLIGHT SECTION ==================
function mapMembership(level) {
    switch (level) {
        case 3: return { text: "Gold", class: "membership-gold" };
        case 2: return { text: "Silver", class: "membership-silver" };
        default: return { text: "Bronze", class: "membership-bronze" };
    }
}

async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Members data not found");
        const data = await response.json();
        const members = data.members;

        const filtered = members.filter(m => m.membership >= 2); // Gold or Silver
        const randomSpotlights = [];
        while (randomSpotlights.length < 3 && filtered.length > 0) {
            const randomIndex = Math.floor(Math.random() * filtered.length);
            randomSpotlights.push(filtered.splice(randomIndex, 1)[0]);
        }

        const container = document.getElementById("spotlights");
        randomSpotlights.forEach(member => {
            const membershipInfo = mapMembership(member.membership);
            const card = document.createElement("div");
            card.classList.add("spotlight-card");
            card.innerHTML = `
                <img src="images/${member.icon}" alt="${member.name} Logo">
                <h3>${member.name}</h3>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                <span class="membership-badge ${membershipInfo.class}">${membershipInfo.text} Member</span>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        document.getElementById("spotlights").innerHTML = "<p>Unable to load member spotlights.</p>";
        console.error(error);
    }
}
loadSpotlights();
