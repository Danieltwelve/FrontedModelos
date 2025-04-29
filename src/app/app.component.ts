import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa el servicio Router
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'login_detect';

  constructor(private router: Router) {} // Inyecta el servicio Router

  navigateToRegister() {
    this.router.navigate(['/register']); // Navega a la ruta de registro
  }
}