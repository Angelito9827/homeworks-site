import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GetTaskListRequest } from '../../models/get-task-list/get-task-list.request';
import { Observable } from 'rxjs';
import { GetTaskListResponse } from '../../models/get-task-list/get-task-list.response';
import { CreateTaskRequest } from '../../models/create-task/create-task.request';
import { GetAllTasksRequest } from '../../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { GetAllTasksResponse } from '../../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { EditTaskRequest } from '../../models/edit-task/edit-task.request';
import { GetTaskByIdRequest } from '../../models/get-active-task-by-id/get-active-task-by-id.request';
import { GetTaskByIdResponse } from '../../models/get-active-task-by-id/get-active-task-by-id.response';
import { TaskChangeStateRequest } from '../../models/task-change-state/task-change-state.request';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = environment.baseUrlApi; // URL base de la API desde el archivo de configuración de entorno
  apiUrl = environment.api; // URL específica para las operaciones relacionadas con las tareas desde el archivo de configuración de entorno

  constructor(private httpClient: HttpClient) { }

  // Método para obtener la lista de tareas paginada
  public get(request: GetTaskListRequest): Observable<GetTaskListResponse> {
    let queryParams = new HttpParams()
      .set("page", request.page.toString()) // Página solicitada
      .set("pageSize", request.pageSize.toString()); // Tamaño de página

    return this.httpClient.get<GetTaskListResponse>(`${this.apiUrl}task`, { params: queryParams });
  }

  // Método para crear una nueva tarea
  public createTask(request: CreateTaskRequest) {
    return this.httpClient.post(`${this.apiUrl}task`, request);
  }

  // Método para obtener todas las tareas activas según el ID de la casa, con filtros opcionales por categoría y estado de tarea
  public getAllTasks(request: GetAllTasksRequest): Observable<GetAllTasksResponse> {
    let queryParams = new HttpParams();

    if (request.categoryId) {
      queryParams = queryParams.set("categoryId", request.categoryId.toString()); // Filtrar por ID de categoría si está presente
    }

    if (request.taskState) {
      queryParams = queryParams.set("taskState", request.taskState.toString()); // Filtrar por estado de tarea si está presente
    }

    return this.httpClient.get<GetAllTasksResponse>(`${this.baseUrl}tasks/house/${request.houseId}`, { params: queryParams });
  }

  // Método para obtener los detalles de una tarea por su ID
  public getTaskById(request: GetTaskByIdRequest): Observable<GetTaskByIdResponse> {
    return this.httpClient.get<GetTaskByIdResponse>(`${this.baseUrl}tasks/${request.id}`);
  }

  // Método para editar una tarea existente
  public editTask(request: EditTaskRequest): Observable<GetAllTasksResponse> {
    return this.httpClient.put<GetAllTasksResponse>(`${this.apiUrl}task`, request);
  }

  // Método para eliminar una tarea por su ID
  public deleteTaskById(request: GetTaskByIdRequest): Observable<GetTaskByIdResponse> {
    return this.httpClient.delete<GetTaskByIdResponse>(`${this.apiUrl}task/${request.id}`);
  }

  // Método para cambiar el estado de una tarea
  public changeTaskState(request: TaskChangeStateRequest) {
    return this.httpClient.patch<GetTaskByIdResponse>(`${this.apiUrl}task`, request);
  }
}
