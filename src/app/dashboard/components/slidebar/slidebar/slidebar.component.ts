import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Importa NavigationEnd
import { filter } from 'rxjs/operators'; // Importa filter

@Component({
  selector: 'app-slidebar',
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.css']
})
export class SlidebarComponent {
  // Nueva propiedad para almacenar la ruta activa
  activeRoute: string = '';

  constructor(private router: Router) {
    // Suscribirse a los eventos del router para actualizar activeRoute
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Extrae la ruta principal después de /dashboard/ o /
      const urlSegments = event.urlAfterRedirects.split('/');
      if (urlSegments[1] === 'dashboard' && urlSegments.length > 2) {
        this.activeRoute = urlSegments[2]; // Captura la parte de la ruta después de /dashboard/
      } else if (urlSegments[1] === 'landing-page') {
        this.activeRoute = 'landing-page'; // Para la ruta de landing-page
      } else {
        this.activeRoute = ''; // Por si no hay ruta activa o es otra cosa
      }
    });
  }

  navigateTo(route: string): void {
    if (route === 'landing-page') {
      this.router.navigate(['/landing-page']);
    } else {
      this.router.navigate(['/dashboard', route]);
    }
    // No necesitas actualizar activeRoute aquí, el router.events se encargará
  }
}