import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '⛅ Weather webapp @Master 3ir²';
  isNavbarCollapsed = true;
  constructor(private router: Router) {
    // Abonnement à l'événement de fin de navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isNavbarCollapsed = true; // Replier le menu après la navigation
      }
    });
  }
}
