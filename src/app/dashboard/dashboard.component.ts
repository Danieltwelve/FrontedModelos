import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./components/navbar/navbar/navbar.component";
import { SlidebarComponent } from "./components/slidebar/slidebar/slidebar.component";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NavbarComponent, SlidebarComponent]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Cualquier inicialización general del dashboard
  }
}