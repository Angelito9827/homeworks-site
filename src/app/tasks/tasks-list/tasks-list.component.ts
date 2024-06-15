import { Component, ViewChild } from '@angular/core';
import { TaskService } from '../services/tasks-service/task.service';
import { GetTaskListRequest } from '../models/get-task-list/get-task-list.request';
import {
  GetTaskListResponse,
  GetTaskListItemResponse,
} from '../models/get-task-list/get-task-list.response';
import { TaskState } from '../models/task-status.enum';
import { TaskChangeStateRequest } from '../models/task-change-state/task-change-state.request';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  user: string = '';
  state = TaskState;
  response?: GetTaskListResponse;
  request: GetTaskListRequest = { page: 0, pageSize: 12, totalCount:0 };


  constructor(private taskService: TaskService, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getRole();
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
          this.request.totalCount = response.totalCount;
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
  
  changeStateOnClick(task: GetTaskListItemResponse) {

    switch (task.state) {
      case TaskState.DRAFT:
        this.changeState(TaskState.NEW, task.id)
        break;
        case TaskState.NEW:
          this.changeState(TaskState.IN_PROGRESS, task.id)
        break;
        case TaskState.IN_PROGRESS:
          this.changeState(TaskState.FINISHED, task.id)
        break;
        default:
          console.error(`Unknown state: ${task.state}`);
    }

   
    this.getTasksList()
  }

  changeState(state: TaskState, id:number) {
    const request: TaskChangeStateRequest = {state:state,id:id}
    console.log(request);

    this.taskService
    .changeTaskState(request)
    .pipe()
    .subscribe()
  }

  onPageChange(page: number) {
    // Actualiza el número de página en la solicitud y vuelve a obtener la lista de "paticas"
    this.request.page = page - 1;
    this.getTasksList()
  }

}
