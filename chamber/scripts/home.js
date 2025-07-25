// ================== WEATHER SECTION ==================
const weatherApiKey = "25e73c2a4b1d953c7ae045390f4bbfc9";
const city = "Lagos";
const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;

async function fetchWeather() {
    try {
        const response = await fetch(weatherURL);
        if (!response.ok) throw new Error("Weather data not available");
        const data = await response.json();

        // Current weather
        const current = data.list[0];
        const sunriseTime = new Date(data.city.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const sunsetTime = new Date(data.city.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const iconCode = current.weather[0].icon;
        const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        document.getElementById("weather-icon").src = iconSrc;
        document.getElementById("weather-icon").alt = current.weather[0].description;
        document.getElementById("current-description").textContent = current.weather[0].description;
        document.getElementById("current-temp").textContent = `Temperature: ${current.main.temp.toFixed(1)}°C`;
        document.getElementById("high-low-temp").textContent = `High: ${current.main.temp_max.toFixed(1)}°C | Low: ${current.main.temp_min.toFixed(1)}°C`;
        document.getElementById("humidity").textContent = `Humidity: ${current.main.humidity}%`;
        document.getElementById("sunrise").textContent = `Sunrise: ${sunriseTime}`;
        document.getElementById("sunset").textContent = `Sunset: ${sunsetTime}`;

        // 3-day forecast (every 8th item ≈ 1 day)
        const forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "";
        for (let i = 8; i <= 24; i += 8) {
            const day = data.list[i];
            const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
            const iconCode = day.weather[0].icon;
            const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            forecastDiv.innerHTML += `
        <p><strong>${date}:</strong> <img src="${iconSrc}" alt="${day.weather[0].description}" style="width: 30px; vertical-align: middle;"> ${day.main.temp.toFixed(1)}°C</p>
      `;
        }
    } catch (error) {
        document.getElementById("weather").innerHTML = "<h3>Current Weather in Lagos</h3><p>Unable to load current weather data.</p>";
        document.getElementById("forecast").innerHTML = "<p>Unable to load forecast data.</p>";
        console.error(error);
    }
}
fetchWeather();

// ================== SPOTLIGHT SECTION ==================
async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Members data not found");

        const data = await response.json();

        let membersArray;
        if (Array.isArray(data)) {
            membersArray = data;
        } else if (data.members && Array.isArray(data.members)) {
            membersArray = data.members;
        } else {
            throw new Error("Invalid members data format.");
        }

        // CORRECTED: Filter by the numeric 'membership' key
        const filtered = membersArray.filter(member =>
            member.membership === 3 || member.membership === 2
        );

        // Helper function to get membership level string from number
        const getMembershipLevel = (num) => {
            switch (num) {
                case 3: return "Gold";
                case 2: return "Silver";
                case 1: return "Bronze";
                default: return "";
            }
        };

        // Randomly select 2–3
        const randomSpotlights = [];
        while (randomSpotlights.length < 3 && filtered.length > 0) {
            const randomIndex = Math.floor(Math.random() * filtered.length);
            randomSpotlights.push(filtered.splice(randomIndex, 1)[0]);
        }

        // Render to DOM
        const container = document.getElementById("spotlights");
        if (!container) {
            console.error('Error: Spotlight container with ID "spotlights" not found.');
            return;
        }

        if (randomSpotlights.length === 0) {
            container.innerHTML = "<p>No Gold or Silver members to display at this time.</p>";
            return;
        }

        randomSpotlights.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("spotlight-card");
            // CORRECTED: Use member.icon and the helper function for membership level
            const membershipLevel = getMembershipLevel(member.membership);
            card.innerHTML = `
        <img src="images/${member.icon}" alt="${member.name} Logo" class="spotlight-logo">
        <h3>${member.name}</h3>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Address:</strong> ${member.address}</p>
        <p><a href="${member.website}" target="_blank">Visit Website</a></p>
        <p class="membership-badge membership-${membershipLevel.toLowerCase()}">${membershipLevel} Member</p>
      `;
            container.appendChild(card);
        });
    } catch (error) {
        document.getElementById("spotlights").innerHTML = "<p>Unable to load member spotlights.</p>";
        console.error(error);
    }
}
loadSpotlights();