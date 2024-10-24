var app;
window.onload = function () {
    app = new Vue({
        el: "#weatherApp", // cible l'élément HTML #weatherApp où nous allons utiliser VueJS
        data: {
            // Sera utilisé comme indicateur de chargement de l'application
            loaded: false,

            // cityName, variable utilisée dans le formulaire via v-model
            formCityName: "",

            // Messages à afficher dans l'application
            message: "WebApp Loaded.",
            messageForm: "",

            // Liste des villes saisies, initialisée avec Paris
            cityList: [
                {
                    name: "Paris",
                },
            ],

            // cityWeather contiendra les données météo reçues d'OpenWeatherMap
            cityWeather: null,

            // Indicateur de chargement pour la météo
            cityWeatherLoading: false,
        },

        // 'mounted' est exécuté une fois que l'application Vue est complètement initialisée
        mounted: function () {
            this.loaded = true;
            this.readData();

        // Récupérer la météo pour Paris au démarrage, mais sans modifier cityWeather
            if (this.cityList.length > 0) {
            this.cityList.forEach(city => {
            this.fetchWeather(city.name); // Appeler la méthode fetchWeatherForList pour chaque ville sans mettre à jour cityWeather
        });
    }
        },

        // Méthodes définies ici, elles vont traiter les données décrites dans 'data'
        methods: {
            readData: function (event) {
                console.log(
                    "JSON.stringify(this.cityList): ",
                    JSON.stringify(this.cityList)
                ); // Affiche la liste des villes dans la console
                console.log("this.loaded:", this.loaded); // Affiche 'this.loaded: true' pour vérifier que l'application est prête
            },
            addCity: function (event) {
                event.preventDefault(); // Empêche le rechargement de la page à la soumission du formulaire

                console.log("formCityName:", this.formCityName);
                
                // Vérifier si le champ formCityName est vide (nous avons déjà "required", mais c'est une vérification supplémentaire)
                if (this.formCityName.trim() === "") {
                    this.messageForm = "Le champ de saisie ne peut pas être vide.";
                    return;
                }
                // Utiliser isCityExist() pour vérifier si la ville existe déjà
                if (this.isCityExist(this.formCityName)) {
                    this.messageForm = "La ville existe déjà dans la liste.";
                    return;
                }
                // Récupérer les données météo pour la ville ajoutée
                this.fetchWeather(this.formCityName);

                // Ajouter la ville saisie à la liste des villes
                this.cityList.push({ name: this.formCityName });

                // Remise à zéro du message affiché sous le formulaire (si erreur précédente)
                this.messageForm = "";
            
                // Remise à zéro du champ de saisie
                this.formCityName = "";
            },
            // Méthode pour vérifier si la ville existe déjà dans la liste
            isCityExist: function (_cityName) {
                // La méthode 'filter' retourne une liste contenant tous les items ayant un nom égale à _cityName
                if (
                    this.cityList.filter(
                        (item) => item.name.toUpperCase() === _cityName.toUpperCase()
                    ).length > 0
                ) {
                    return true;
                } else {
                    return false;
                }
            },
            remove: function (_city) {
                // Utiliser 'filter' pour retourner une liste contenant uniquement les villes qui n'ont pas le même nom que _city.name
                this.cityList = this.cityList.filter(
                    (item) => item.name.toUpperCase() !== _city.name.toUpperCase()
                );
                
                if (confirm(`Voulez-vous vraiment supprimer ${_city.name} de la liste ?`)) {
                    this.cityList = this.cityList.filter((item) => item.name !== _city.name);
                    this.messageForm = "";
                }
    
                // Message d'information ou remise à zéro du message d'erreur
                this.messageForm = "";
            },
            meteo: function (_city) {
                this.cityWeatherLoading = true;

                // appel AJAX avec fetch pour récupérer la météo via l'API OpenWeatherMap
                // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&lang=fr&appid=78b56b662c11141512ffcb25aa5262b4`)
                fetch('https://api.openweathermap.org/data/2.5/weather?q=' + _city.name + '&units=metric&lang=fr&appid=78b56b662c11141512ffcb25aa5262b4')
                    .then(function (response) {
                        return response.json(); // Transforme la réponse en JSON
                    })
                    .then(function (json) {
                        app.cityWeatherLoading = false; // Utilise "app" pour accéder à l'instance Vue
        
                        // Test du code de retour de l'API
                        if (json.cod == 200) {
                            // Si la réponse est OK (code 200)
                            app.cityWeather = json; // Stocker les données météo dans cityWeather
                            app.message = null; // Pas de message d'erreur
                        } else {
                            // En cas d'erreur (ville non trouvée, etc.)
                            app.cityWeather = null;
                            app.message = 'Météo introuvable pour ' + _city.name + ' (' + json.message + ')';
                        }
                    })
                    .catch(function (error) {
                        // Gérer les erreurs éventuelles lors de l'appel à l'API
                        app.cityWeatherLoading = false;
                        app.cityWeather = null;
                        app.message = 'Une erreur est survenue : ' + error.message;
                    });

            },
             fetchWeather: function (cityName) {
        // Appel API OpenWeatherMap pour récupérer les données météo de la ville ajoutée
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=fr&appid=78b56b662c11141512ffcb25aa5262b4`)
            .then((response) => response.json())
            .then((json) => {
                if (json.cod === 200) {
                    // Trouver la ville dans la liste et mettre à jour la météo
                    const city = this.cityList.find((item) => item.name.toUpperCase() === cityName.toUpperCase());
                    if (city) {
                        // Ajouter les données météo à la ville
                        this.$set(city, 'weather', json);
                    }
                } else {
                    // Gérer le cas où la ville n'a pas été trouvée
                    this.messageForm = `Météo introuvable pour ${cityName}.`;
                }
            })
            .catch((error) => {
                // Gérer les erreurs éventuelles lors de l'appel à l'API
                this.messageForm = `Une erreur est survenue : ${error.message}`;
            });
    },
        },
    });
};
