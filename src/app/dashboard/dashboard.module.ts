import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { SlidebarComponent } from './components/slidebar/slidebar/slidebar.component';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { LivevideoComponent } from './components/livevideo/livevideo/livevideo.component';
import { DevicesComponent } from './components/devices/devices.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    DashboardComponent,
    SlidebarComponent,
    NavbarComponent,
    LivevideoComponent,
    DevicesComponent
  ]
})
export class DashboardModule { }
