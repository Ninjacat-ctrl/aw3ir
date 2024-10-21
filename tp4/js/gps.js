
// demande de la localisation à l'utilisateur
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.querySelector("#map").innerHTML =
            "Geolocation is not supported by this browser.";
    }
}

// Si l'utilisateur l'autorise, on récupère les coordonnées dans l'objet "position"
function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    // Mettre à jour le champ d'adresse avec les coordonnées actuelles
    document.getElementById("adresse").value = latlon;
    var img_url = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=14&size=400x300&markers=color:red|${latlon}&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg`;

    document.querySelector("#map").innerHTML = `<img src='${img_url}'>`;
}

// Au cas où l'utilisateur refuse ou si une erreur survient
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.querySelector("#map").innerHTML =
                "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.querySelector("#map").innerHTML =
                "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.querySelector("#map").innerHTML =
                "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.querySelector("#map").innerHTML = "An unknown error occurred.";
            break;
    }
}
