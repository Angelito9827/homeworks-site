import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GetHouseMemberListByHouseIdRequest } from '../../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.request';
import { GetHouseMemberListByHouseIdResponse } from '../../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseMemberService {

  baseUrl: string = environment.baseUrlApi;
  
  constructor(private http:HttpClient){}

  public  getHouseMembersById(request:GetHouseMemberListByHouseIdRequest):Observable<GetHouseMemberListByHouseIdResponse> {
    return this.http.get<GetHouseMemberListByHouseIdResponse>(`${this.baseUrl}/house-members/house/${request.houseId}`)
  }
}
