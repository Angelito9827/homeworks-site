import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { GetPerfilByIdRequest } from "../models/get-pefil-by-id.request";
import { BehaviorSubject, Observable } from "rxjs";
import { GetPerfilByIdResposne } from "../models/get-perfil-by-id.response";
import { EditPerfilRequest } from "../models/edit-house/edit-perfil-request";
import { CookieService } from "ngx-cookie-service";


@Injectable({
    providedIn: 'root',
  })
  export class PerfilService {
    private role: string = '';
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    baseUrl = environment.baseUrlApi;
    constructor(private httpClient: HttpClient, private cookies: CookieService) {}

    public getPerfilById(request: GetPerfilByIdRequest): Observable<GetPerfilByIdResposne> {
        return this.httpClient.get<GetPerfilByIdResposne>(`${this.baseUrl}perfil`)
    }

    public editPerfil(request: EditPerfilRequest): Observable<GetPerfilByIdResposne> {
      return this.httpClient.put<GetPerfilByIdResposne>(`${this.baseUrl}perfil`, request); 
    }

    public deletePerfil(request: GetPerfilByIdRequest): Observable<GetPerfilByIdResposne> {
      this.cookies.delete("token"); // Elimina el token de autenticación de las cookies
        localStorage.removeItem('user'); // Elimina el rol del usuario del localStorage
        this.role = ''; // Restablece el rol del usuario
        this.isLoggedInSubject.next(false); // Actualiza el estado de inicio de sesión
      return this.httpClient.delete<GetPerfilByIdResposne>(`${this.baseUrl}perfil`)
    }

  }