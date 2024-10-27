import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MeteoService } from "../services/meteo.service";

@Component({
  selector: "app-meteo-detail",
  templateUrl: "./meteo-detail.component.html",
  styleUrls: ["./meteo-detail.component.css"],
})
export class MeteoDetailComponent implements OnInit {
  meteo: any;
  forecast: any;
  dailyForecast: any[] = [];
  latlon: string = "";

  constructor(
    private route: ActivatedRoute,
    private meteoService: MeteoService
  ) { }

  ngOnInit() {
    this.getMeteo();
    this.getForecast();
  }

  getMeteo(): void {
    // pour lire la paramètre 'name' dans l'URL de la page  comme définit dans le router avec
    // path: 'meteo/:name'
    const name = this.route.snapshot.paramMap.get("name");

    console.log("getmeteo pour", name);
    if (name) {
      this.meteoService
        .getMeteo(name)
        .then((response) => {
          this.meteo = response;
          this.latlon = `${this.meteo.coord.lat},${this.meteo.coord.lon}`;
        })
        .catch((fail) => (this.meteo = fail));
    }
  }
  getForecast(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.meteoService
        .getForecast(name)
        .then((response) => {
          this.forecast = response;
          this.processForecast();
        })
        .catch((fail) => {
          console.error('Erreur lors de la récupération des prévisions : ', fail);
        });
    }
  }

  processForecast(): void {
    // Assurez-vous que forecast.list existe et est un tableau avant de continuer
    if (this.forecast && Array.isArray(this.forecast.list)) {
      const groupedForecast: { [key: string]: any[] } = {};

      this.forecast.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const day = date.toISOString().split('T')[0]; // Formate la date comme 'YYYY-MM-DD' pour éviter les erreurs

        // Vérifier si le jour existe déjà dans groupedForecast
        if (!groupedForecast[day]) {
          groupedForecast[day] = [];
        }

        // Ajouter l'élément à la liste pour ce jour
        groupedForecast[day].push(item);
      });

      // Obtenir les dates triées pour avoir les jours dans l'ordre
      const sortedDays = Object.keys(groupedForecast).sort();

      // Filtrer pour commencer à partir de demain
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Réinitialise les heures, minutes, secondes et millisecondes de la date d'aujourd'hui
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Filtrer les prévisions pour exclure aujourd'hui
      const filteredDays = sortedDays.filter(day => {
        const dayDate = new Date(day);
        return dayDate >= tomorrow;
      });

      // Sélectionner les 5 premiers jours seulement à partir de demain
      this.dailyForecast = filteredDays.slice(0, 5).map((key: string) => {
        const dayForecast = groupedForecast[key];
        return dayForecast[0]; // Sélectionner la première prévision du jour
      });
    }
  }




  getTemperatureClass(temp: number): string {
    if (temp <= 10) {
      return 'temp-cold';
    } else if (temp > 10 && temp <= 25) {
      return 'temp-mild';
    } else {
      return 'temp-hot';
    }
  }

}