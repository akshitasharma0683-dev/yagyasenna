
document.addEventListener("DOMContentLoaded", () => {

    initTrustedCircle();
    initJourney();

    const homeElements = [
        document.querySelector(".welcome"),
        document.querySelector(".sos-section"),
        document.querySelector(".section:not(.trusted-section)"),
        document.querySelector(".reminder")
    ];

    const trustedSection = document.getElementById("trustedSection");
    const journeySection = document.getElementById("journeySection");

    // TRUSTED CIRCLE
    document.getElementById("contactsCard")
        .addEventListener("click", () => {

            homeElements.forEach(element => {
                element.hidden = true;
            });

            journeySection.hidden = true;
            trustedSection.hidden = false;

            trustedSection.scrollIntoView({
                behavior: "smooth"
            });
        });

    // SOS
    document.getElementById("sosButton")
        .addEventListener("click", () => {

            const choice = confirm("Call emergency number 112?");

            if (choice) {
                window.location.href = "tel:112";
            }
        });

    // JOURNEY MODE
    document.getElementById("journeyCard")
        .addEventListener("click", () => {

            homeElements.forEach(element => {
                element.hidden = true;
            });

            trustedSection.hidden = true;
            window.openJourney();
        });

    // SAFETY JOURNAL
    document.getElementById("journalCard")
        .addEventListener("click", () => {
            alert("Safety Journal is coming next!");
        });

    // SAFETY RESOURCES
    document.getElementById("resourcesCard")
        .addEventListener("click", () => {
            alert("Safety Resources are coming next!");
        });

    // BACK TO HOME FROM JOURNEY
    document.getElementById("journeyBack")
        .addEventListener("click", () => {

            journeySection.hidden = true;

            homeElements.forEach(element => {
                element.hidden = false;
            });
        });

});
