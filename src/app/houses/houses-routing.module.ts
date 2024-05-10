import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousesListComponent } from './houses-list/houses-list.component';
import { HousesAddComponent } from './houses-add/houses-add.component';
import { HouseEditDeleteComponent } from './house-edit-delete/house-edit-delete.component';

const routes: Routes = [
  { path: '', component: HousesListComponent },
  { path: 'new', component: HousesAddComponent },
  { path: 'edit-delete', component: HouseEditDeleteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousesRoutingModule { }
