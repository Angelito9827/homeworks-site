import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HousesRoutingModule } from './houses-routing.module';
import { HousesComponent } from './houses.component';
import { HousesListComponent } from './houses-list/houses-list.component';
import { HousesAddComponent } from './houses-add/houses-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HouseEditDeleteComponent } from './house-edit-delete/house-edit-delete.component';
import { HouseDetailComponent } from './house-detail/house-detail.component';



@NgModule({
  declarations: [
    HousesComponent,
    HousesListComponent,
    HousesAddComponent,
    HouseEditDeleteComponent,
    HouseDetailComponent,
  ],
  imports: [
    CommonModule,
    HousesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HousesModule { }
