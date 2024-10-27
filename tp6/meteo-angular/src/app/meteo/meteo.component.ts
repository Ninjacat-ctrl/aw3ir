import { Component, OnInit } from "@angular/core";
import { MeteoService } from "../services/meteo.service";
import { MeteoItem } from "../meteoItem";

@Component({
  selector: "app-meteo",
  templateUrl: "./meteo.component.html",
  styleUrls: ["./meteo.component.css"],
})
export class MeteoComponent implements OnInit {
  city: MeteoItem = {
    name: "",
    id: 0,
    weather: null,
  };

  cityList: MeteoItem[] = [];

  constructor(private meteoService: MeteoService) { }

  ngOnInit() {
    // const storedList = localStorage.getItem("cityList");

    // if (storedList !== undefined && storedList !== null) {
    //   this.cityList = JSON.parse(storedList);
    // } else {
    //   this.cityList = [];
    //   this.cityList.forEach((city) => {
    //     if (city.name) {
    //       this.updateCityWeather(city);
    //     }
    //   });
    // }


    // Charger les données depuis le localStorage
    const storedList = localStorage.getItem("cityList");

    if (storedList !== undefined && storedList !== null) {
      this.cityList = JSON.parse(storedList);

      // Après avoir chargé les données, mettre à jour la météo de chaque ville
      this.cityList.forEach((city) => {
        if (city.name) {
          this.updateCityWeather(city);
        }
      });
    } else {
      // Si aucune donnée n'est trouvée dans le localStorage, initialiser cityList comme un tableau vide
      this.cityList = [];
    }
  }

  onSubmit() {
    if (
      this.city.name !== undefined &&
      this.isCityExist(this.city.name) === false
    ) {
      let currentCity = new MeteoItem();
      currentCity.name = this.city.name;
      this.cityList.push(currentCity);
      this.fetchWeatherForCity(currentCity);
      this.saveCityList();

      console.log(this.city.name, "ajouté à la dans la liste");
    } else {
      console.log(this.city.name, "existe déjà dans la liste");
    }
  }

  remove(_city: MeteoItem) {
    // on utilise 'filter' pour retourne une liste avec tous les items ayant un nom différent de _city.name
    this.cityList = this.cityList.filter(
      (item: MeteoItem) => item.name != _city.name
    );
    this.saveCityList();
  }

  updateCityWeather(city: MeteoItem): void {
    if (city.name) {
      this.meteoService.getMeteo(city.name).then(response => {
        city.weather = {
          icon: response.weather[0].id,
          temp: response.main.temp
        };
        // Après mise à jour de la météo, sauvegarder dans le localStorage
        this.saveCityList();
      }).catch(error => {
        console.error('Erreur lors de la récupération des données météo pour', city.name, error);
      });
    }
  }

  isCityExist(_cityName: string) {
    // la méthode 'filter' retourne une liste contenant tous les items ayant un nom égale à _cityName
    // doc. sur filter : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/filter
    if (
      this.cityList.filter(
        (item: MeteoItem) => item.name?.toUpperCase() == _cityName.toUpperCase()
      ).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  saveCityList(): void {
    localStorage.setItem("cityList", JSON.stringify(this.cityList));
  }

  fetchWeatherForCity(city: MeteoItem) {
    if (city.name) {
      this.meteoService.getMeteo(city.name).then((response) => {
        city.weather = {
          temp: response.main.temp,
          icon: response.weather[0].id,
        };
      }).catch((error) => {
        console.error('Erreur lors de la récupération des données météo pour ', city.name, ':', error);
      });
    } else {
      console.warn('Nom de la ville est indéfini');
    }
  }

}