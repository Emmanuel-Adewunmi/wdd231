document.addEventListener("DOMContentLoaded", () => {
    // Set timestamp
    document.getElementById("timestamp").value = new Date().toISOString();

    // Animate cards
    const cards = document.querySelectorAll(".card");
    setTimeout(() => {
        cards.forEach((card, i) => {
            setTimeout(() => card.classList.add("show"), i * 150);
        });
    }, 200);

    // Modal handling
    const modals = document.querySelectorAll(".modal");
    const buttons = document.querySelectorAll(".card button");
    const closes = document.querySelectorAll(".modal .close");

    buttons.forEach(button => {
        button.addEventListener("click", e => {
            const modalId = e.target.parentElement.dataset.modal;
            document.getElementById(modalId).style.display = "block";
        });
    });

    closes.forEach(close => {
        close.addEventListener("click", e => {
            e.target.closest(".modal").style.display = "none";
        });
    });

    window.addEventListener("click", e => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });
});
