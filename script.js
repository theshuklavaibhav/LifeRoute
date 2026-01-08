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
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            sendEmergency(latitude, longitude);
        },
        () => {
            alert("Please enable GPS/location to request an ambulance.");
            reset();
        }
    );
});

function sendEmergency(latitude, longitude) {
    // working API Call for MVP-v1
    fetch("https://emergencetest-ddb6dadse3hwacgj.eastasia-01.azurewebsites.net/api/healthcheck", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    })
    
    //------MVP-v2 API Call -----------------------------------------|
    //     fetch("/api/emergency", {   // ✅ FIXED (relative path)
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         latitude: latitude,
    //         longitude: longitude
    //     })
    // })
    .then(response => response.json())
    .then(data => {
        const dispatchNumber = "918586847909"; // ✅ your WhatsApp number (demo dispatch)

        const whatsappUrl =
            `https://wa.me/${dispatchNumber}?text=` +
            encodeURIComponent(data.whatsappMessage);

        // Open WhatsApp with pre-filled message
        window.open(whatsappUrl, "_blank");

        // User confirmation
        alert(
            data.message +
            "\nStatus: Ambulance dispatch initiated"
        );

        reset();
    })
    .catch(() => {
        alert("Emergency service temporarily unavailable. Please try again.");
        reset();
    });
}

function reset() {
    btn.innerText = "🚨 REQUEST AMBULANCE";
    btn.disabled = false;
}
