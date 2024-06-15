import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { CreatePerfilRequest } from "../models/create-perfil/create-perfil.request";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { sha256 } from 'js-sha256';

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private role: string = ''; 
    private userEmail: string = '';
    private isLoggedInSubject = new BehaviorSubject<boolean>(false); 
    private readonly roleSubject = new Subject<string>(); 
    baseUrl = environment.baseUrlApi;
    private isLoginPageSubject = new BehaviorSubject<boolean>(false);

    constructor(private httpClient: HttpClient, private cookies: CookieService) { 
      const savedRole = localStorage.getItem('user');
      if (savedRole) {
          this.role = savedRole;
          this.roleSubject.next(this.role); 
      }
    }

    public createPerfil(request:CreatePerfilRequest) {

      const encryptedPassword = sha256(request.password);

      const userWithEncryptedPassword = { ...request, password: encryptedPassword };

      return this.httpClient.post(`${this.baseUrl}register`, request)
      }

      login(user: any): Observable<any> {
        console.log('Datos enviados al backend:', user); // Imprime los datos de usuario enviados al backend 
          return this.httpClient.post(`${this.baseUrl}login`, user); // Hace una solicitud HTTP POST al endpoint de inicio de sesión
      }

   

    // Método para establecer el token de autenticación en las cookies
    setToken(token: string) {
        this.cookies.set("token", token);
    }

    // Método para obtener el token de autenticación desde las cookies
    getToken() {
        return this.cookies.get("token");
    }

    setRole(role: string) {
      this.role = role; // Establece el rol en la propiedad del servicio
      localStorage.setItem('user', role); // Guarda el rol en el localStorage
      this.roleSubject.next(role); // Emite el cambio de rol
  }

  // Método para obtener el rol del usuario
  getRole(): string {
      return this.role; // Retorna el rol almacenado en la propiedad del servicio
  }

     // Método para establecer el correo electrónico del usuario
    setUserEmail(email: string) {
        this.userEmail = email; // Establece el correo electrónico en la propiedad del servicio
    }

     // Método para obtener el correo electrónico del usuario
    getUserEmail(): string {
        return this.userEmail; // Retorna el correo electrónico almacenado en la propiedad del servicio
    }

    // Método para obtener el rol del usuario basado en su correo electrónico
    getUser(email?: string): string {
        if (email) {
            this.setUserEmail(email); // Establece el correo electrónico si se proporciona
        }
        const userEmail = this.getUserEmail(); // Obtiene el correo electrónico del usuario
        if (userEmail === "user@example.com") {
            return "user"; // Retorna "user" si el correo electrónico es "user@example.com"
        } else {
            return ""; // Retorna vacío si no se encuentra el rol
        }
    }


    // Método para verificar si el usuario está autenticado
    isLoggedIn(): Observable<boolean> {
        const token = this.getToken(); // Obtiene el token de autenticación desde las cookies
        const isLoggedIn = !!token; // Comprueba si hay un token (usuario autenticado)

        // Actualiza el estado de inicio de sesión en el BehaviorSubject
        this.isLoggedInSubject.next(true);

        return this.isLoggedInSubject.asObservable(); // Retorna el BehaviorSubject como un Observable
    }

     // Método para obtener el Subject que emite cambios en el rol del usuario
    getRoleSubject(): Subject<string> {
        return this.roleSubject; // Retorna el Subject que emite cambios en el rol
    }

    // Método para cerrar sesión del usuario
    logOut() {
        this.cookies.delete("token"); // Elimina el token de autenticación de las cookies
        localStorage.removeItem('user'); // Elimina el rol del usuario del localStorage
        this.role = ''; // Restablece el rol del usuario
        this.isLoggedInSubject.next(false); // Actualiza el estado de inicio de sesión
    }

    setIsLoginPage(isLoginPage: boolean) {
      this.isLoginPageSubject.next(isLoginPage); // Actualiza el valor del BehaviorSubject con el valor proporcionado
    }
  
    // Método para obtener el estado actual de la página de inicio de sesión
    getIsLoginPage() {
      return this.isLoginPageSubject.asObservable(); // Retorna un observable del BehaviorSubject para que los componentes puedan suscribirse y recibir actualizaciones
    }
    
  }