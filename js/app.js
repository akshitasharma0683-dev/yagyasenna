
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

            homeElements.forEach(element => element.hidden = true);

            journeySection.hidden = true;
            trustedSection.hidden = false;

            trustedSection.scrollIntoView({ behavior: "smooth" });
        });

    // SOS MODAL
    const sosModal = document.getElementById("sosModal");

    document.getElementById("sosButton")
        .addEventListener("click", () => {
            sosModal.hidden = false;
        });

    document.getElementById("call112")
        .addEventListener("click", () => {
            window.location.href = "tel:112";
        });

    document.getElementById("shareSOSLocation")
        .addEventListener("click", () => {

            if (!navigator.geolocation) {
                alert("Location is not supported by this browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {

                    const { latitude, longitude } = position.coords;

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
                        } else {
                            await navigator.clipboard.writeText(
                                `${shareData.text} ${locationUrl}`
                            );
                            alert("Location link copied. You can now send it to a trusted contact.");
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
                { enableHighAccuracy: true, timeout: 15000 }
            );
        });

    document.getElementById("closeSOS")
        .addEventListener("click", () => {
            sosModal.hidden = true;
        });

    // JOURNEY MODE
    document.getElementById("journeyCard")
        .addEventListener("click", () => {

            homeElements.forEach(element => element.hidden = true);

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

            homeElements.forEach(element => element.hidden = false);
        });

});
