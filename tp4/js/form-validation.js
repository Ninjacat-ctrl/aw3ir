window.onload = function () {
    console.log("DOM ready!");
    
    displayContactList();

    function displayMessage(message, type) {
        const messageContainer = document.getElementById("messageContainer");
        messageContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    }

    // Ajouter un écouteur pour le bouton de géolocalisation
    const btnGps = document.getElementById("geoButton");
    if (btnGps) {
        btnGps.addEventListener("click", function () {
            getLocation();  // Appel de la fonction getLocation définie dans gps.js
        });
    } else {
        console.error("Le bouton de géolocalisation (geoButton) est introuvable.");
    }

    

    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault();
        let valid = true;

        // Validation de nom et prénom (5 caractères minimum)
        const fields = ["nom", "prenom", "adresse"];
        fields.forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (field.value.length < 5) {
                alert(`${fieldId} doit contenir au moins 5 caractères.`);
                valid = false;
            }
        });

        // Validation de l'email
        const email = document.getElementById("email").value;
        if (!validateEmail(email)) {
            alert("Email invalide.");
            valid = false;
        }

        // Validation de la date de naissance (pas dans le futur)
        const birthday = document.getElementById("birthday").value;
        const birthdayDate = new Date(birthday);
        const birthdayTimestamp = birthdayDate.getTime();
        const nowTimestamp = Date.now();
        
        if (birthdayTimestamp > nowTimestamp) {
            alert("La date de naissance ne peut pas être dans le futur.");
            valid = false;
        }

        
        if (valid) {
            // Récupérer les données du formulaire
            const nom = document.getElementById("nom").value;
            const prenom = document.getElementById("prenom").value;
            const adresse = document.getElementById("adresse").value;
            const dateNaissance = document.getElementById("birthday").value;

            // Ajouter le contact au tableau JSON
            contactStore.add(nom, prenom, dateNaissance, adresse, email);

            // Afficher le message de succès
            displayMessage("Contact ajouté avec succès.", "success");
            
            // Mettre à jour le titre de la fenêtre modale
            const modalTitle = `Bienvenue ${prenom}`;
            document.getElementById("exampleModalLabel").textContent = modalTitle;
        
            // Message de bienvenue personnalisé
            const welcomeMessage = `Vous êtes né le ${dateNaissance} et vous habitez à : `;
            document.getElementById("welcomeMessage").textContent = welcomeMessage;
        
            // Génération de l'URL de la carte Google Maps
            const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(adresse)}`;
            const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(adresse)}&zoom=14&size=400x300&scale=2&markers=${encodeURIComponent(adresse)}&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg`;
        
            // Mise à jour du lien et de l'image de la carte
            document.getElementById("mapsLink").href = mapsUrl;
            document.getElementById("mapsImage").src = staticMapUrl;
            
            // Mise à jour du texte du lien sous l'image de la carte
            const mapsLinkTextElement = document.getElementById("mapsLinkText");
            // mapsLinkTextElement.href = `https://www.google.com/maps/search/?api=1&query=${adresse}`;
            mapsLinkTextElement.href = mapsUrl;
            mapsLinkTextElement.textContent = adresse;

            // Afficher la fenêtre modale si tout est correct
            var myModal = new bootstrap.Modal(document.getElementById("myModal"));
            myModal.show();
        }
    });

    // Interception du clic sur le bouton de géolocalisation
    document.getElementById("geoButton").addEventListener("click", function () {
        getLocation(); // Appel de la fonction depuis gps.js
    });

    // Changer la couleur du bouton de soumission après clic
    document.querySelector("button[type='button']").addEventListener("click", function () {
        this.setAttribute("style", "background-color: #FFD700; border-color: #FFD700; color: #000;");
    });

    function displayContactList() {
        // Récupérer la liste des contacts à partir de localStorage
        const contactListString = localStorage.getItem("contactList");
        const contactList = contactListString ? JSON.parse(contactListString) : [];
    
        // Mettre à jour le nombre de contacts
        document.getElementById("contactCount").textContent = contactList.length;
    
        // Sélectionner le corps du tableau (tbody)
        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = ""; // Vider le tableau avant de l'afficher pour éviter les doublons
    
        // Ajouter chaque contact sous forme de ligne (tr)
        for (const contact of contactList) {
            tbody.innerHTML += `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.firstname}</td>
                <td>${contact.date}</td>
                <td><a href="https://maps.google.com/?q=${encodeURIComponent(contact.address)}" target="_blank">${contact.address}</a></td>
                <td><a href="mailto:${contact.mail}">${contact.mail}</a></td>
            </tr>`;
        }
    }
    

    document.getElementById("resetContacts").addEventListener("click", function () {
        contactStore.reset();
        displayContactList(); // Mettre à jour l'affichage pour refléter la suppression
    });

    function validateEmail(email) {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
};

// Fonction de comptage des caractères saisies
function calcNbChar(id) {
    // Met à jour le texte de la balise span juste après l'input
    document.querySelector(`#${id} + span`).textContent = `${document.querySelector(`#${id}`).value.length} car.`;
    }
