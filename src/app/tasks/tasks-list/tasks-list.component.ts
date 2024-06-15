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
  styleUrls: ['./tasks-list.component.css'],
})
export class TasksListComponent {
  user: string = '';
  state = TaskState;
  response?: GetTaskListResponse;
  request: GetTaskListRequest = { page: 0, pageSize: 12, totalCount: 0 };

  constructor(private taskService: TaskService, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getRole();
    this.getTasksList();
  }

  private getTasksList() {
    // Obtiene la lista de tareas paginada al inicializar el componente o cuando se cambia de página
    this.taskService.get(this.request).subscribe({
      next: (response: GetTaskListResponse) => {
        console.log(response);
        this.response = response;
        this.request.totalCount = response.totalCount;
      },
      error: (error) => {
        console.error('Error fetching tasks', error);
      },
    });
  }

  expandedIndex: number = -1;

  // Función para expandir o contraer los detalles de una tarea en la lista
  toggleDetails(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1; // Si ya está expandido, se contrae
    } else {
      this.expandedIndex = index; // Si no está expandido, se expande
    }
  }

  // Verifica si una tarea está expandida o no
  isExpanded(index: number): boolean {
    return this.expandedIndex === index;
  }
  
  // Cambia el estado de la tarea al hacer clic en el botón correspondiente
  changeStateOnClick(task: GetTaskListItemResponse) {
    switch (task.state) {
      case TaskState.DRAFT:
        this.changeState(TaskState.NEW, task.id);
        break;
      case TaskState.NEW:
        this.changeState(TaskState.IN_PROGRESS, task.id);
        break;
      case TaskState.IN_PROGRESS:
        this.changeState(TaskState.FINISHED, task.id);
        break;
      default:
        console.error(`Unknown state: ${task.state}`);
    }
  }

  // Realiza la solicitud para cambiar el estado de la tarea
  changeState(state: TaskState, id: number) {
    const request: TaskChangeStateRequest = { state: state, id: id };

    this.taskService.changeTaskState(request).subscribe({
      next: () => {
        console.log(`Task ${id} state changed to ${state}`);
        this.getTasksList(); // Actualiza la lista de tareas después de cambiar el estado
      },
      error: (error) => {
        console.error(`Error changing state of task ${id}`, error);
      },
    });
  }

  // Función llamada cuando se cambia de página en la paginación
  onPageChange(page: number) {
    // Actualiza el número de página en la solicitud y vuelve a obtener la lista de tareas
    this.request.page = page - 1; // La paginación en la API suele ser basada en cero, por lo que ajustamos aquí
    this.getTasksList();
  }
}
