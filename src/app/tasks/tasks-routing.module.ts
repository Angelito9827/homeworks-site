import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { ActiveTasksComponent } from './active-tasks/active-tasks.component';


const routes: Routes = [
  { path: '', component: TasksListComponent },
  { path: 'house/:houseId/category/:categoryId', component: ActiveTasksComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
