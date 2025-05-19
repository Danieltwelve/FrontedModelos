import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slidebar',
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.css']
})
export class SlidebarComponent {
  constructor(private router: Router) {}

 navigateTo(route: string): void {
  if (route === 'landing-page') {
    this.router.navigate(['/landing-page']);
  } else {
    this.router.navigate(['/dashboard', route]);
  }
}
  
}