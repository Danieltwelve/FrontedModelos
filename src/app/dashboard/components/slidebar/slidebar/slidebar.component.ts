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
  this.router.navigate([route]);
}
  
}