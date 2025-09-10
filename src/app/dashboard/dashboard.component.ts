import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./components/navbar/navbar/navbar.component";
import { SlidebarComponent } from "./components/slidebar/slidebar/slidebar.component";
import { LivevideoComponent } from './components/livevideo/livevideo/livevideo.component';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NavbarComponent, SlidebarComponent, RouterModule],
})
export class DashboardComponent {

}