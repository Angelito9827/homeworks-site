import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousesListComponent } from './houses-list/houses-list.component';
import { HousesAddComponent } from './houses-add/houses-add.component';
import { HouseEditDeleteComponent } from './house-edit-delete/house-edit-delete.component';
import { HouseDetailComponent } from './house-detail/house-detail.component';


const routes: Routes = [
  { path: '', component: HousesListComponent },
  { path: 'new', component: HousesAddComponent },
  { path: ':houseId/edit-delete', component: HouseEditDeleteComponent },
  { path: ':id', component: HouseDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousesRoutingModule { }
