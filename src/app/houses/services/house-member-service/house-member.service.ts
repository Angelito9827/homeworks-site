import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GetHouseMemberListByHouseIdRequest } from '../../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.request';
import { GetHouseMemberListByHouseIdResponse } from '../../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendInvitationEmailRequest } from '../../models/send-invitation-email/send-invitation-email.request';

@Injectable({
  providedIn: 'root'
})
export class HouseMemberService {

  baseUrl: string = environment.baseUrlApi;
  
  constructor(private http:HttpClient){}

  public  getHouseMembersByHouseId(request:GetHouseMemberListByHouseIdRequest):Observable<GetHouseMemberListByHouseIdResponse> {
    return this.http.get<GetHouseMemberListByHouseIdResponse>(`${this.baseUrl}/house-members/house/${request.houseId}`)
  }

  public sendInvitationEmail(request:SendInvitationEmailRequest){
    return this.http.post(`${this.baseUrl}/house-member/send-invitation`, request)
  }
}
