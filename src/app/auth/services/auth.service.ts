import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { CreatePerfilRequest } from "../models/create-perfil/create-perfil.request";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    baseUrl = environment.baseUrlApi;
    constructor(private httpClient: HttpClient) { }

    public createPerfil(request:CreatePerfilRequest) {
        return this.httpClient.post(`${this.baseUrl}login`, request)
      }
    
  }