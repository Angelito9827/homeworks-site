import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetHouseListRequest } from '../../models/get-house-list/get-house-list.request';
import { Observable } from 'rxjs';
import { GetHouseListResponse } from '../../models/get-house-list/get-house-list.response';
import { GetHouseByIdRequest } from '../../models/get-house-by-id/get-house-by-id.request';
import { GetHouseByIdResponse } from '../../models/get-house-by-id/get-house-by-id-response';
import { EditHouseRequest } from '../../models/edit-house/edit-house.request';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  baseUrl = environment.baseUrlApi;
  apiUrl = environment.api;
  constructor(private httpClient: HttpClient) {}

  // este metodo hace una petición http GET y envia los parametros como query params
  public get(request: GetHouseListRequest): Observable<GetHouseListResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams
      .set('page', request.page.toString())
      .set('pageSize', request.pageSize.toString());

    return this.httpClient.get<GetHouseListResponse>(`${this.apiUrl}house`, {
      params: queryParams,
    });
  }

  // este metodo hace una petición http POST y envia los parametros en el body
  public createHouse(request: FormData): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}house`, request, {
      reportProgress: true,
      observe: 'events',
    });
  }

  // este metodo hace una petición http GET y envia los parametros como route params
  public getHouseById(
    request: GetHouseByIdRequest
  ): Observable<GetHouseByIdResponse> {
    return this.httpClient.get<GetHouseByIdResponse>(
      `${this.apiUrl}house/${request.id}`
    );
  }

  public editHouse(
    request: FormData
  ): Observable<GetHouseByIdResponse> {
    return this.httpClient.put<GetHouseByIdResponse>(
      `${this.apiUrl}house`,
      request
    );
  }

  public deleteHouseById(
    request: GetHouseByIdRequest
  ): Observable<GetHouseByIdResponse> {
    return this.httpClient.delete<GetHouseByIdResponse>(
      `${this.apiUrl}house/${request.id}`
    );
  }
}
