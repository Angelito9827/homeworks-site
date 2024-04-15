import { Component, ViewChild } from '@angular/core';
import { TaskService } from '../task-service/task.service';
import { GetTaskListRequest } from '../models/get-task-list/get-task-list.request';
import { GetTaskListResponse, GetTaskListItemResponse } from '../models/get-task-list/get-task-list.response';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent {


  response?: GetTaskListResponse;
  request: GetTaskListRequest = { page: 0, pageSize: 15 }

  displayedColumns: string[] = ['id', 'name', 'state', 'createdAt', 'finishDate'];
  dataSource: MatTableDataSource<GetTaskListItemResponse>;

  names: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private taskService: TaskService) {
    this.dataSource = new MatTableDataSource<GetTaskListItemResponse>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.getTasksList();

  }

  private getTasksList() {
    this.taskService.get(this.request)
      .pipe()
      .subscribe({
        next: (response: GetTaskListResponse) => {
          console.log(response);
          this.response = response;
          this.dataSource.data = this.response.tasks;
        }
      });
  }
}