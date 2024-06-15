import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; // Importar configuración de entorno
import { GetHouseMemberListByHouseIdRequest } from '../../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.request'; // Importar modelo de solicitud GetHouseMemberListByHouseIdRequest
import { GetHouseMemberListByHouseIdResponse } from '../../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response'; // Importar modelo de respuesta GetHouseMemberListByHouseIdResponse
import { HttpClient } from '@angular/common/http'; // Importar módulo HttpClient
import { Observable } from 'rxjs'; // Importar Observable de RxJS
import { SendInvitationEmailRequest } from '../../models/send-invitation-email/send-invitation-email.request'; // Importar modelo de solicitud SendInvitationEmailRequest

@Injectable({
  providedIn: 'root' // Indicar que el servicio está disponible en el nivel raíz
})
export class HouseMemberService {

  baseUrl: string = environment.baseUrlApi; // Establecer la URL base del API desde el entorno

  constructor(private httpClient: HttpClient) {} // Inyectar HttpClient en el constructor

  // Método para obtener la lista de miembros de una casa por su ID utilizando HTTP GET
  public getHouseMembersByHouseId(request: GetHouseMemberListByHouseIdRequest): Observable<GetHouseMemberListByHouseIdResponse> {
    return this.httpClient.get<GetHouseMemberListByHouseIdResponse>(`${this.baseUrl}/house-members/house/${request.houseId}`);
  }

  // Método para enviar una invitación por correo electrónico utilizando HTTP POST
  public sendInvitationEmail(request: SendInvitationEmailRequest) {
    return this.httpClient.post(`${this.baseUrl}/house-member/send-invitation`, request);
  }

  // Método para eliminar un miembro de una casa por su ID utilizando HTTP DELETE
  public deleteMemberByHouseId(request: GetHouseMemberListByHouseIdRequest): Observable<GetHouseMemberListByHouseIdResponse> {
    return this.httpClient.delete<GetHouseMemberListByHouseIdResponse>(`${this.baseUrl}houses/${request.houseId}`);
  }

}
