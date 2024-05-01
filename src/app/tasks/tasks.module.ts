import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    TasksComponent,
    TasksListComponent,

  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule
  ]
})
export class TasksModule { }
