import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>', // Corrige el template
  standalone: true,
  imports: [RouterModule] // Agrega RouterModule aquí
})
export class AppComponent {}