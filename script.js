const btn = document.getElementById("emergencyBtn");

btn.addEventListener("click", () => {
    btn.innerText = "📍 Detecting Location...";
    btn.disabled = true;

    if (!navigator.geolocation) {
        alert("Geolocation not supported on this device.");
        reset();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            sendEmergency(lat, lon);
        },
        () => {
            alert("Please enable GPS to request ambulance.");
            reset();
        }
    );
});

function sendEmergency(lat, lon) {
    fetch("https://liferoute-api-gdhwdhcdffhcenbh.centralindia-01.azurewebsites.net/api/emergency", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitude: lat,
            longitude: lon
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(
            data.message +
            "\nStatus: " + data.status
        );
        reset();
    })
    .catch(() => {
        alert("Emergency service temporarily unavailable.");
        reset();
    });
}

function reset() {
    btn.innerText = "🚨 REQUEST AMBULANCE";
    btn.disabled = false;
}
