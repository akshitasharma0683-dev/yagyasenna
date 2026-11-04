
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // INITIALIZE FEATURES
    // =====================================

    initTrustedCircle();
    initJourney();
    initJournal();

    // =====================================
    // SECTION REFERENCES
    // =====================================

    const homeElements = [
        document.querySelector(".welcome"),
        document.querySelector(".sos-section"),
        document.querySelector(".section:not(.trusted-section)"),
        document.querySelector(".reminder")
    ];

    const trustedSection = document.getElementById("trustedSection");
    const journeySection = document.getElementById("journeySection");
    const journalSection = document.getElementById("journalSection");
    const resourcesSection = document.getElementById("resourcesSection");
    // Hide dashboard and other sections
    function hideAllSections() {
        homeElements.forEach(element => {
            if (element) element.hidden = true;
        });

        if (trustedSection) trustedSection.hidden = true;
        if (journeySection) journeySection.hidden = true;
        if (journalSection) journalSection.hidden = true;
        if (resourcesSection) resourcesSection.hidden = true;
    }

    // Show dashboard
    function showHome() {
        hideAllSections();

        homeElements.forEach(element => {
            if (element) element.hidden = false;
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // =====================================
    // TRUSTED CIRCLE
    // =====================================

    document.getElementById("contactsCard")
        .addEventListener("click", () => {

            hideAllSections();
            trustedSection.hidden = false;

            trustedSection.scrollIntoView({
                behavior: "smooth"
            });
        });

    // =====================================
    // SOS EMERGENCY MODAL
    // =====================================

    const sosModal = document.getElementById("sosModal");

    document.getElementById("sosButton")
        .addEventListener("click", () => {
            sosModal.hidden = false;
        });

    // Call emergency number
    document.getElementById("call112")
        .addEventListener("click", () => {
            window.location.href = "tel:112";
        });

    // Share current location
    document.getElementById("shareSOSLocation")
        .addEventListener("click", () => {

            if (!navigator.geolocation) {
                alert("Location is not supported by this browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {

                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    const locationUrl =
                        `https://www.google.com/maps?q=${latitude},${longitude}`;

                    const shareData = {
                        title: "My Emergency Location",
                        text: "I may need help. Here is my current location:",
                        url: locationUrl
                    };

                    try {
                        if (navigator.share) {
                            await navigator.share(shareData);
                        } else if (navigator.clipboard) {
                            await navigator.clipboard.writeText(
                                `${shareData.text} ${locationUrl}`
                            );

                            alert("Location link copied. You can send it to a trusted contact.");
                        } else {
                            prompt("Copy your location link:", locationUrl);
                        }

                    } catch (error) {

                        if (error.name !== "AbortError") {
                            alert("Unable to share location. Please try again.");
                        }
                    }
                },

                () => {
                    alert("Unable to access your location. Please check GPS permission.");
                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });

    // Close SOS modal
    document.getElementById("closeSOS")
        .addEventListener("click", () => {
            sosModal.hidden = true;
        });

    // =====================================
    // JOURNEY MODE
    // =====================================

    document.getElementById("journeyCard")
        .addEventListener("click", () => {

            hideAllSections();

            window.openJourney();
        });

    document.getElementById("journeyBack")
        .addEventListener("click", () => {
            showHome();
        });

    // =====================================
    // SAFETY JOURNAL
    // =====================================

    document.getElementById("journalCard")
        .addEventListener("click", () => {

            hideAllSections();

            journalSection.hidden = false;

            journalSection.scrollIntoView({
                behavior: "smooth"
            });
        });

    document.getElementById("journalBack")
        .addEventListener("click", () => {
            showHome();
        });

    // =====================================
    // SAFETY RESOURCES
    // =====================================

    // SAFETY RESOURCES
document.getElementById("resourcesCard")
    .addEventListener("click", () => {

        hideAllSections();

        resourcesSection.hidden = false;

        resourcesSection.scrollIntoView({
            behavior: "smooth"
        });
    });

// BACK TO HOME FROM RESOURCES
document.getElementById("resourcesBack")
    .addEventListener("click", () => {
        showHome();
    });

});
