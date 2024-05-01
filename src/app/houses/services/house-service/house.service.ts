import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GetHouseListRequest } from "../../models/get-house-list/get-house-list.request";
import { Observable } from "rxjs";
import { GetHouseListResponse } from "../../models/get-house-list/get-house-list.response";
import { CreateHouseRequest } from "../../models/create-house/create-house.request";

@Injectable({
    providedIn: 'root'
  })
  export class HouseService {
  
    baseUrl = environment.baseUrlApi;
    constructor(private httpClient: HttpClient) { }

    public get(request: GetHouseListRequest): Observable<GetHouseListResponse> {

        let queryParams = new HttpParams();
        queryParams.set("page",request.page)
        queryParams.set("pageSize",request.pageSize)
    
        return this.httpClient.get<GetHouseListResponse>(`${this.baseUrl}houses`, { params: queryParams })
      }

      public createHouse(request:CreateHouseRequest) {
        this.httpClient.post(`${this.baseUrl}houses`, request)
      }
  }