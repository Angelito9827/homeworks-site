import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GetTaskListRequest } from '../models/get-task-list/get-task-list.request';
import { Observable } from 'rxjs';
import { GetTaskListResponse } from '../models/get-task-list/get-task-list.response';
import { CreateTaskRequest } from '../models/create-task/create-task.request';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = environment.baseUrlApi;
  constructor(private httpClient: HttpClient) { }


  public get(request: GetTaskListRequest): Observable<GetTaskListResponse> {

    let queryParams = new HttpParams();
    queryParams.set("page",request.page)
    queryParams.set("pageSize",request.pageSize)

    return this.httpClient.get<GetTaskListResponse>(`${this.baseUrl}tasks`, { params: queryParams })
  }

  public createTask(request:CreateTaskRequest) {
    this.httpClient.post(`${this.baseUrl}tasks`, request)
  }

}