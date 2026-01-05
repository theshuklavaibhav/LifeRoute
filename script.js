const btn = document.getElementById("emergencyBtn");

btn.addEventListener("click", () => {
    btn.innerText = "📍 Detecting Location...";
    btn.disabled = true;

    if (!navigator.geolocation) {
        alert("Location not supported on this device.");
        reset();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const message =
                "🚨 EMERGENCY REQUEST\n\n" +
                "LifeRoute Alert\n" +
                "Location:\n" +
                "Latitude: " + lat + "\n" +
                "Longitude: " + lon;

            alert(message);

            reset();
        },
        () => {
            alert("Please enable GPS to continue.");
            reset();
        }
    );
});

function reset() {
    btn.innerText = "🚨 REQUEST AMBULANCE";
    btn.disabled = false;
}
