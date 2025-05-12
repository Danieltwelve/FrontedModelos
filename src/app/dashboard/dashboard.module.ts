import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { SlidebarComponent } from './components/slidebar/slidebar/slidebar.component';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DashboardComponent,
    SlidebarComponent,
    NavbarComponent
  ],
 // exports: [
   // DashboardComponent,
   // SlidebarComponent
  //]
})
export class DashboardModule { }