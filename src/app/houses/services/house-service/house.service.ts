import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetHouseListRequest } from '../../models/get-house-list/get-house-list.request';
import { Observable } from 'rxjs';
import { GetHouseListResponse } from '../../models/get-house-list/get-house-list.response';
import { CreateHouseRequest } from '../../models/create-house/create-house.request';
import { GetHouseByIdRequest } from '../../models/get-house-by-id/get-house-by-id.request';
import { GetHouseByIdResponse } from '../../models/get-house-by-id/get-house-by-id-response';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  baseUrl = environment.baseUrlApi;
  constructor(private httpClient: HttpClient) {}

  // este metodo hace una petición http GET y envia los parametros como query params
  public get(request: GetHouseListRequest): Observable<GetHouseListResponse> {
    let queryParams = new HttpParams();
    queryParams.set('page', request.page);
    queryParams.set('pageSize', request.pageSize);

    return this.httpClient.get<GetHouseListResponse>(`${this.baseUrl}houses`, {
      params: queryParams,
    });
  } 

  // este metodo hace una petición http POST y envia los parametros en el body
  public createHouse(request: CreateHouseRequest) {
    this.httpClient.post(`${this.baseUrl}houses`, request);
  }

  // este metodo hace una petición http GET y envia los parametros como route params
  public getHouseById(request:GetHouseByIdRequest): Observable<GetHouseByIdResponse> {
    return this.httpClient.get<GetHouseByIdResponse>(`${this.baseUrl}houses/${request.id}`)
  }
 }
