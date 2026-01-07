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

            // sendEmergency(latitude, longitude);
            sendEmergencyV2(latitude, longitude);
        },
        () => {
            alert("Please enable GPS/location to request an ambulance.");
            reset();
        }
    );
});

function sendEmergency(latitude, longitude) {
    // working API Call for MVP-v1
    // fetch("https://liferoute-api-gdhwdhcdffhcenbh.centralindia-01.azurewebsites.net/api/emergency", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         latitude: latitude,
    //         longitude: longitude
    //     })
    // })
    
    //------MVP-v2 API Call -----------------------------------------|
//         fetch("/api/createEmergencyRequest", {   // ✅ FIXED (relative path)
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             latitude: latitude,
//             longitude: longitude
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         const dispatchNumber = "918586847909"; // ✅ your WhatsApp number (demo dispatch)

//         const whatsappUrl =
//             `https://wa.me/${dispatchNumber}?text=` +
//             encodeURIComponent(data.whatsappMessage);

//         // Open WhatsApp with pre-filled message
//         window.open(whatsappUrl, "_blank");

//         // User confirmation
//         alert(
//             data.message +
//             "\nStatus: Ambulance dispatch initiated"
//         );

//         reset();
//     })
//     .catch(() => {
//         alert("Emergency service temporarily unavailable. Please try again.");
//         reset();
//     });
// }

function sendEmergencyV2(latitude, longitude) {
    // Disable button to prevent double clicks
    btn.innerText = "Connecting to emergency dispatch...";
    btn.disabled = true;

    fetch("/api/createEmergencyRequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            lat: latitude,
            lng: longitude,
            type: "Medical"
        })
    })
    .then(response => response.json())
    .then(data => {

        // 1️⃣ Validate response
        if (!data.dispatchLinks || data.dispatchLinks.length === 0) {
            throw new Error("No dispatchers available");
        }

        // 2️⃣ Open WhatsApp dispatch links (first responder wins)
        data.dispatchLinks.forEach(link => {
            window.open(link, "_blank");
        });

        // 3️⃣ Inform user
        alert(
            "Emergency request sent.\n" +
            "Waiting for a dispatcher to accept."
        );

        // 4️⃣ Optional: store requestId for later status tracking
        window.currentEmergencyRequestId = data.requestId;

        reset();

    })
    .catch(err => {
        console.error(err);
        alert(
            "Unable to contact emergency dispatch.\n" +
            "Please try again or call local emergency services."
        );
        reset();
    });
}


function reset() {
    btn.innerText = "🚨 REQUEST AMBULANCE";
    btn.disabled = false;
}
