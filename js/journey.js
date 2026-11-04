
const JOURNEY_KEY = "yagyasenna_active_journey";

function initJourney() {

    const form = document.getElementById("journeyForm");
    const setup = document.getElementById("journeySetup");
    const active = document.getElementById("activeJourney");
    const section = document.getElementById("journeySection");

    const gpsStatus = document.getElementById("gpsStatus");
    const locationDetails = document.getElementById("locationDetails");
    const coordinates = document.getElementById("coordinates");
    const mapLink = document.getElementById("mapLink");

    let journey = JSON.parse(
        localStorage.getItem(JOURNEY_KEY) || "null"
    );

    let currentLocation = journey?.location || null;
    let destinationLocation = journey?.destinationLocation || null;

    let map = null;
    let currentMarker = null;
    let destinationMarker = null;
    let accuracyCircle = null;
    let routeLine = null;

    let interval = null;
    let gpsWatchId = null;
    let overdueAlertShown = false;

    const mapStatus = document.getElementById("mapStatus");

    function saveJourney() {
        localStorage.setItem(
            JOURNEY_KEY,
            JSON.stringify(journey)
        );
    }

    // INITIALIZE MAP
    function initializeMap() {

        if (map) {
            setTimeout(() => map.invalidateSize(), 150);
            return;
        }

        map = L.map("journeyMap").setView([20.5937, 78.9629], 5);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        ).addTo(map);

        mapStatus.textContent = "Map ready";
    }

    // UPDATE CURRENT LOCATION MARKER
    function updateCurrentMarker(location) {

        initializeMap();

        const position = [location.lat, location.lng];

        if (!currentMarker) {

            currentMarker = L.marker(position)
                .addTo(map)
                .bindPopup("Your current location");

        } else {

            currentMarker.setLatLng(position);
        }

        if (location.accuracy) {

            if (!accuracyCircle) {
                accuracyCircle = L.circle(position, {
                    radius: location.accuracy,
                    color: "#8055b8",
                    fillOpacity: 0.10
                }).addTo(map);
            } else {
                accuracyCircle.setLatLng(position);
                accuracyCircle.setRadius(location.accuracy);
            }
        }

        updateMapView();
    }

    // DESTINATION MARKER
    function updateDestinationMarker(location) {

        initializeMap();

        const position = [location.lat, location.lng];

        if (!destinationMarker) {

            destinationMarker = L.marker(position)
                .addTo(map)
                .bindPopup("Your destination");

        } else {

            destinationMarker.setLatLng(position);
        }

        updateMapView();
    }

    // ADJUST MAP TO SHOW BOTH LOCATIONS
    function updateMapView() {

        const points = [];

        if (currentMarker) {
            points.push(currentMarker.getLatLng());
        }

        if (destinationMarker) {
            points.push(destinationMarker.getLatLng());
        }

        if (points.length === 1) {
            map.setView(points[0], 16);
        }

        if (points.length === 2) {
            map.fitBounds(
                L.latLngBounds(points),
                { padding: [45, 45], maxZoom: 15 }
            );
        }
    }

    // GPS LOCATION
    function getGPS() {

        if (!navigator.geolocation) {
            gpsStatus.textContent =
                "GPS is not supported by this browser.";
            return;
        }

        gpsStatus.textContent = "Detecting location...";

        navigator.geolocation.getCurrentPosition(
            showLocation,
            handleLocationError,
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    }

    function showLocation(position) {

        currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
        };

        gpsStatus.textContent = "Location detected successfully";

        coordinates.textContent =
            `Lat: ${currentLocation.lat.toFixed(5)}, ` +
            `Lng: ${currentLocation.lng.toFixed(5)} ` +
            `(±${Math.round(currentLocation.accuracy)} m)`;

        mapLink.href =
            `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;

        locationDetails.hidden = false;

        if (journey) {
            journey.location = currentLocation;
            saveJourney();
        }

        updateCurrentMarker(currentLocation);

        mapStatus.textContent = "Current location detected";

        const liveStatus = document.getElementById("liveLocationStatus");

        if (liveStatus) {
            liveStatus.textContent = "Current location updated";
        }
    }

    function handleLocationError(error) {

        const messages = {
            1: "Location permission denied.",
            2: "Location is unavailable.",
            3: "Location request timed out."
        };

        gpsStatus.textContent =
            messages[error.code] || "Unable to detect location.";

        mapStatus.textContent = "Location unavailable";
    }

    function startLiveTracking() {

        if (!navigator.geolocation) return;

        if (gpsWatchId !== null) {
            navigator.geolocation.clearWatch(gpsWatchId);
        }

        gpsWatchId = navigator.geolocation.watchPosition(
            showLocation,
            handleLocationError,
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 15000
            }
        );
    }

    // DESTINATION GEOCODING
    async function findDestination(address) {

        mapStatus.textContent = "Finding destination...";

        try {

            const url =
                "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
                encodeURIComponent(address);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Destination lookup failed");
            }

            const results = await response.json();

            if (!results.length) {
                return null;
            }

            return {
                lat: Number(results[0].lat),
                lng: Number(results[0].lon)
            };

        } catch (error) {

            console.error("Destination lookup:", error);
            return null;
        }
    }

    // JOURNEY TIMER
    function updateTimer() {

        if (!journey) return;

        const remaining = journey.endAt - Date.now();

        const countdown = document.getElementById("countdown");
        const status = document.getElementById("journeyStatus");
        const message = document.getElementById("journeyMessage");

        if (remaining <= 0) {

            countdown.textContent = "00:00";

            status.textContent = "CHECK-IN OVERDUE";
            status.classList.add("overdue");

            message.textContent =
                "Your check-in time has passed. Please confirm your safety.";

            if (!overdueAlertShown) {
                overdueAlertShown = true;

                alert(
                    "Your journey check-in is overdue. Please confirm your safety."
                );
            }

            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        countdown.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    // START JOURNEY
    form.addEventListener("submit", async event => {

        event.preventDefault();

        const destination =
            document.getElementById("destination").value.trim();

        const duration =
            Number(document.getElementById("duration").value);

        if (!destination || !Number.isFinite(duration) || duration <= 0) {
            alert("Enter a valid destination and duration.");
            return;
        }

        if (!currentLocation) {
            alert("Please detect your current location first.");
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = "Finding destination...";

        try {

            destinationLocation = await findDestination(destination);

            journey = {
                destination,
                startedAt: Date.now(),
                endAt: Date.now() + duration * 60000,
                location: currentLocation,
                destinationLocation
            };

            saveJourney();

            setup.hidden = true;
            active.hidden = false;

            document.getElementById("journeyDestination")
                .textContent = destination;

            initializeMap();
            updateCurrentMarker(currentLocation);

            if (destinationLocation) {

                updateDestinationMarker(destinationLocation);

                mapStatus.textContent =
                    "Current location and destination shown";

                routeLine = L.polyline(
                    [
                        [currentLocation.lat, currentLocation.lng],
                        [destinationLocation.lat, destinationLocation.lng]
                    ],
                    {
                        color: "#8055b8",
                        weight: 4,
                        dashArray: "8, 8"
                    }
                ).addTo(map);

            } else {

                mapStatus.textContent =
                    "Destination not found. Showing current location.";

            }

            overdueAlertShown = false;

            startLiveTracking();

            updateTimer();

            if (interval) clearInterval(interval);

            interval = setInterval(updateTimer, 1000);

            setTimeout(() => map.invalidateSize(), 200);

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Start My Journey";

        }
    });

    // SHARE CURRENT LOCATION
    document.getElementById("shareLocation")
        .addEventListener("click", async () => {

            if (!currentLocation) {
                alert("Current location is not available.");
                return;
            }

            const url =
                `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;

            try {

                if (navigator.share) {

                    await navigator.share({
                        title: "My current location",
                        text: "Here is my current location.",
                        url
                    });

                } else if (navigator.clipboard) {

                    await navigator.clipboard.writeText(url);

                    alert("Location link copied. Share it with someone you trust.");

                } else {

                    window.open(url, "_blank", "noopener");

                }

            } catch (error) {

                if (error.name !== "AbortError") {
                    alert("Unable to share location.");
                }
            }
        });

    function stopTracking() {

        if (gpsWatchId !== null) {
            navigator.geolocation.clearWatch(gpsWatchId);
            gpsWatchId = null;
        }

        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    function resetJourney() {

        stopTracking();

        localStorage.removeItem(JOURNEY_KEY);

        journey = null;
        currentLocation = null;
        destinationLocation = null;
        overdueAlertShown = false;

        if (currentMarker) map.removeLayer(currentMarker);
        if (destinationMarker) map.removeLayer(destinationMarker);
        if (accuracyCircle) map.removeLayer(accuracyCircle);
        if (routeLine) map.removeLayer(routeLine);

        currentMarker = null;
        destinationMarker = null;
        accuracyCircle = null;
        routeLine = null;

        active.hidden = true;
        setup.hidden = false;

        locationDetails.hidden = true;
        gpsStatus.textContent = "Location not detected yet";
        mapStatus.textContent = "Waiting for location";

        form.reset();
    }

    document.getElementById("completeJourney")
        .addEventListener("click", () => {

            if (!confirm("Confirm that you have arrived safely?")) return;

            resetJourney();

            alert("Journey completed. Glad you checked in! ♡");
        });

    document.getElementById("cancelJourney")
        .addEventListener("click", () => {

            if (!confirm("End this journey?")) return;

            resetJourney();
        });

    document.getElementById("getLocation")
        .addEventListener("click", getGPS);

    // RESTORE EXISTING JOURNEY
    if (journey) {

        setup.hidden = true;
        active.hidden = false;

        document.getElementById("journeyDestination")
            .textContent = journey.destination;

        initializeMap();

        if (journey.location) {
            currentLocation = journey.location;
            updateCurrentMarker(currentLocation);
        }

        if (journey.destinationLocation) {
            destinationLocation = journey.destinationLocation;
            updateDestinationMarker(destinationLocation);

            routeLine = L.polyline(
                [
                    [currentLocation.lat, currentLocation.lng],
                    [destinationLocation.lat, destinationLocation.lng]
                ],
                {
                    color: "#8055b8",
                    weight: 4,
                    dashArray: "8, 8"
                }
            ).addTo(map);
        }

        updateTimer();
        startLiveTracking();

        interval = setInterval(updateTimer, 1000);
    }

    window.openJourney = function() {

        section.hidden = false;

        section.scrollIntoView({
            behavior: "smooth"
        });

        initializeMap();
    };
}

window.initJourney = initJourney;
