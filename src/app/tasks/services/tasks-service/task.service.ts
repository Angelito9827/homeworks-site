import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GetTaskListRequest } from '../../models/get-task-list/get-task-list.request';
import { Observable } from 'rxjs';
import { GetTaskListResponse } from '../../models/get-task-list/get-task-list.response';
import { CreateTaskRequest } from '../../models/create-task/create-task.request';
import { GetAllTasksRequest} from '../../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { GetAllTasksResponse } from '../../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { EditTaskRequest } from '../../models/edit-task/edit-task.request';
import { GetTaskByIdRequest } from '../../models/get-active-task-by-id/get-active-task-by-id.request';
import { GetTaskByIdResponse } from '../../models/get-active-task-by-id/get-active-task-by-id.response';
import { TaskChangeStateRequest } from '../../models/task-change-state/task-change-state.request';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = environment.baseUrlApi;
  apiUrl = environment.api;
  constructor(private httpClient: HttpClient) { }


  public get(request: GetTaskListRequest): Observable<GetTaskListResponse> {

    let queryParams = new HttpParams();
    queryParams = queryParams.set("page", request.page.toString())
    .set("pageSize", request.pageSize.toString());

    return this.httpClient.get<GetTaskListResponse>(`${this.apiUrl}task`, { params: queryParams })
  }

  public createTask(request:FormData) {
    return this.httpClient.post(`${this.apiUrl}task`, request)
  }

  public getAllTasks(request:GetAllTasksRequest): Observable<GetAllTasksResponse> {
    
    let queryParams = new HttpParams();
    if (request.categoryId) 
      queryParams.set("categoryId", request.categoryId)

    if (request.taskState) 
      queryParams.set("taskState", request.taskState)

    return this.httpClient.get<GetAllTasksResponse>(`${this.baseUrl}tasks/house/${request.houseId}`,{params: queryParams})
  }

  public getTaskById(request:GetTaskByIdRequest): Observable<GetTaskByIdResponse> {
    return this.httpClient.get<GetTaskByIdResponse>(`${this.baseUrl}tasks/${request.id}`)
  }

  public editTask(request: EditTaskRequest): Observable<GetAllTasksResponse> {
    return this.httpClient.put<GetAllTasksResponse>(`${this.baseUrl}tasks`, request); 
  }

  public deleteTaskById(request:GetTaskByIdRequest): Observable<GetTaskByIdResponse> {
    return this.httpClient.delete<GetTaskByIdResponse>(`${this.baseUrl}tasks/${request.id}`)
  }

  public changeTaskState(request: TaskChangeStateRequest) {
    return this.httpClient.put<GetTaskByIdResponse>(`${this.baseUrl}tasks/change-state`,request)
  }

}