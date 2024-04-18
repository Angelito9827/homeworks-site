import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HousesRoutingModule } from './houses-routing.module';
import { HousesComponent } from './houses.component';
import { HousesListComponent } from './houses-list/houses-list.component';


@NgModule({
  declarations: [
    HousesComponent,
    HousesListComponent
  ],
  imports: [
    CommonModule,
    HousesRoutingModule
  ]
})
export class HousesModule { }
