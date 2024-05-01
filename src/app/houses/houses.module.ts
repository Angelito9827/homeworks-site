import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HousesRoutingModule } from './houses-routing.module';
import { HousesComponent } from './houses.component';
import { HousesListComponent } from './houses-list/houses-list.component';
import { HousesAddComponent } from './houses-add/houses-add.component';


@NgModule({
  declarations: [
    HousesComponent,
    HousesListComponent,
    HousesAddComponent
  ],
  imports: [
    CommonModule,
    HousesRoutingModule
  ]
})
export class HousesModule { }
