import { Component } from '@angular/core';
import { GetAllTasksResponse } from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/tasks-service/task.service';
import { GetAllTasksRequest } from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { TaskState } from '../models/task-status.enum';
import { GetHouseByIdResponse } from '../../houses/models/get-house-by-id/get-house-by-id-response';
import { HouseService } from '../../houses/services/house-service/house.service';
import { AuthService } from '../../auth/services/auth.service';
import { CategoryState } from '../models/category-status.enum';

@Component({
  selector: 'app-active-tasks',
  templateUrl: './active-tasks.component.html',
  styleUrls: ['./active-tasks.component.css']
})
export class ActiveTasksComponent {
  user: string = ''; // Variable para almacenar el rol del usuario
  state = TaskState; // Enumeración para los estados de las tareas
  activeTasksResponse?: GetAllTasksResponse; // Variable para almacenar la respuesta de tareas activas
  houseResponse?: GetHouseByIdResponse; // Variable para almacenar la respuesta de la casa
  categories = CategoryState; // Enumeración para los estados de las categorías de tareas

  constructor(
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private houseService: HouseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtiene el rol del usuario del servicio de autenticación
    this.activatedRoute.params.subscribe(params => {
      const houseId = params['houseId']; // Obtiene el ID de la casa de los parámetros de la ruta
      const categoryId = params['categoryId']; // Obtiene el ID de la categoría de los parámetros de la ruta
      this.getHouseById(houseId); // Obtiene los detalles de la casa por su ID
      this.getTasks(houseId, categoryId); // Obtiene las tareas activas según el ID de la casa y la categoría
    });
  }

  private getTasks(houseId: number, categoryId: number) {
    let request: GetAllTasksRequest = {
      houseId: houseId,
      categoryId: categoryId,
      taskState: TaskState.IN_PROGRESS // Filtra las tareas en estado "en progreso"
    };
    this.taskService.getAllTasks(request)
      .pipe()
      .subscribe({
        next: (response: GetAllTasksResponse) => {
          this.activeTasksResponse = response; // Almacena la respuesta de las tareas activas
        }
      });
  }

  private getHouseById(houseId: number) {
    this.houseService.getHouseById({ id: houseId })
      .subscribe({
        next: (response: GetHouseByIdResponse) => {
          this.houseResponse = response; // Almacena la respuesta de la casa
        }
      });
  }
}
