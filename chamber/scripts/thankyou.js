document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    document.getElementById("display-firstName").textContent = params.get("firstName") || "N/A";
    document.getElementById("display-lastName").textContent = params.get("lastName") || "N/A";
    document.getElementById("display-email").textContent = params.get("email") || "N/A";
    document.getElementById("display-phone").textContent = params.get("phone") || "N/A";
    document.getElementById("display-organization").textContent = params.get("organization") || "N/A";

    // Format timestamp into readable date
    let timestamp = params.get("timestamp");
    if (timestamp) {
        const dateObj = new Date(timestamp);
        document.getElementById("display-timestamp").textContent = dateObj.toLocaleString();
    } else {
        document.getElementById("display-timestamp").textContent = "N/A";
    }
});
