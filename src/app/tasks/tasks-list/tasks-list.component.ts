import { Component, ViewChild } from '@angular/core';
import { TaskService } from '../task-service/task.service';
import { GetTaskListRequest } from '../models/get-task-list/get-task-list.request';
import {
  GetTaskListResponse,
  GetTaskListItemResponse,
} from '../models/get-task-list/get-task-list.response';
import { TaskState } from '../models/task-status.enum';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  response?: GetTaskListResponse;
  request: GetTaskListRequest = { page: 0, pageSize: 15 };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getTasksList();
  }

  private getTasksList() {
    this.taskService
      .get(this.request)
      .pipe()
      .subscribe({
        next: (response: GetTaskListResponse) => {
          console.log(response);
          this.response = response;
          //this.dataSource.data = this.response.tasks;
        },
      });
  }

  expandedIndex: number = -1;

  toggleDetails(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1;
    } else {
      this.expandedIndex = index;
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedIndex === index;
  }

  getTaskString(state: TaskState): string {
    switch (state) {
      case TaskState.DRAFT:
        return 'Borrador';

      case TaskState.IN_PROGRESS:
        return 'En progreso';

      case TaskState.KO:
        return 'KO';

      case TaskState.OK:
        return 'OK';

      default:
        return 'Desconocido';
    }
  }
}
