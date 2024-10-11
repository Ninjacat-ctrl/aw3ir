window.onload = () => {
    // https://developer.mozilla.org/fr/docs/Web/API/Window/load_event
    const paramsString = document.location.search; // Récupérer des données envoyées par le formulaire
    const searchParams = new URLSearchParams(paramsString); // https://developer.mozilla.org/fr/docs/Web/API/URLSearchParams
  
    // Itérer sur les paramètres de la recherche
    for (const param of searchParams) {
      console.log(param);
  
      const elementId = param[0];
      const elementValue = param[1];
      const element = document.getElementById(elementId);
  
      // Mise à jour du contenu de l'élément HTML si trouvé
      if (element !== null) {
        element.textContent = elementValue;
      }
  
      // Mise à jour des liens hypertextes pour l'adresse et l'e-mail
      if (param[0] === "address") {
        element.href = `https://www.google.com/maps/search/?api=1&query=${elementValue}`;
      } else if (param[0] === "email") {
        element.href = `mailto:${elementValue}?subject=Hello!&body=What's up?`;
      }
    }
    document.getElementById("birthday").setAttribute("max",getTodayDate())
  };

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); //js month start with 0
    const day = String(today.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
}

console.log(getTodayDate());
