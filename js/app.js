
document.addEventListener("DOMContentLoaded", () => {

    initTrustedCircle();

    const homeElements = [
        document.querySelector(".welcome"),
        document.querySelector(".sos-section"),
        document.querySelector(".section:not(.trusted-section)"),
        document.querySelector(".reminder")
    ];

    const trustedSection = document.getElementById("trustedSection");

    document.getElementById("contactsCard")
        .addEventListener("click", () => {

            homeElements.forEach(element => {
                element.hidden = true;
            });

            trustedSection.hidden = false;

            trustedSection.scrollIntoView({
                behavior: "smooth"
            });
        });

    document.getElementById("sosButton")
        .addEventListener("click", () => {

            const choice = confirm(
                "Call emergency number 112?"
            );

            if (choice) {
                window.location.href = "tel:112";
            }
        });

    document.getElementById("journeyCard")
        .addEventListener("click", () => {
            alert("Journey Mode is coming next!");
        });

    document.getElementById("journalCard")
        .addEventListener("click", () => {
            alert("Safety Journal is coming next!");
        });

    document.getElementById("resourcesCard")
        .addEventListener("click", () => {
            alert("Safety Resources are coming next!");
        });

});
