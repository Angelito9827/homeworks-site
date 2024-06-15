import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { GetPerfilByIdRequest } from "../models/get-pefil-by-id.request";
import { BehaviorSubject, Observable } from "rxjs";
import { GetPerfilByIdResponse } from "../models/get-perfil-by-id.response";
import { EditPerfilRequest } from "../models/edit-house/edit-perfil-request";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private role: string = ''; // Variable para almacenar el rol del usuario
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Subject para mantener el estado de inicio de sesión
  baseUrl = environment.baseUrlApi; // URL base de la API desde environment

  constructor(private httpClient: HttpClient, private cookies: CookieService) {}

  // Método para obtener un perfil por ID
  public getPerfilById(request: GetPerfilByIdRequest): Observable<GetPerfilByIdResponse> {
    return this.httpClient.get<GetPerfilByIdResponse>(`${this.baseUrl}perfil`);
  }

  // Método para editar un perfil
  public editPerfil(request: EditPerfilRequest): Observable<GetPerfilByIdResponse> {
    return this.httpClient.put<GetPerfilByIdResponse>(`${this.baseUrl}perfil`, request); 
  }

  // Método para eliminar un perfil
  public deletePerfil(request: GetPerfilByIdRequest): Observable<GetPerfilByIdResponse> {
    this.cookies.delete("token"); // Elimina el token de autenticación de las cookies
    localStorage.removeItem('user'); // Elimina el rol del usuario del localStorage
    this.role = ''; // Restablece el rol del usuario
    this.isLoggedInSubject.next(false); // Actualiza el estado de inicio de sesión
    return this.httpClient.delete<GetPerfilByIdResponse>(`${this.baseUrl}perfil`);
  }
}
