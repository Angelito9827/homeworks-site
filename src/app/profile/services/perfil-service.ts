import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { GetPerfilByIdRequest } from "../models/get-pefil-by-id.request";
import { Observable } from "rxjs";
import { GetPerfilByIdResposne } from "../models/get-perfil-by-id.response";
import { EditPerfilRequest } from "../models/edit-house/edit-perfil-request";


@Injectable({
    providedIn: 'root',
  })
  export class PerfilService {
    baseUrl = environment.baseUrlApi;
    constructor(private httpClient: HttpClient) {}

    public getPerfilById(request: GetPerfilByIdRequest): Observable<GetPerfilByIdResposne> {
        return this.httpClient.get<GetPerfilByIdResposne>(`${this.baseUrl}perfil`)
    }

    public editPerfil(request: EditPerfilRequest): Observable<GetPerfilByIdResposne> {
      return this.httpClient.put<GetPerfilByIdResposne>(`${this.baseUrl}perfil`, request); 
    }

  }