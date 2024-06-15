import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPerfilByIdResponse } from './models/get-perfil-by-id.response';
import { PerfilService } from './services/perfil-service';
import { EditPerfilRequest } from './models/edit-house/edit-perfil-request';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: string = ''; // Variable para almacenar el rol del usuario
  url: any = ''; // Variable para almacenar la URL de la imagen
  perfilResponse?: GetPerfilByIdResponse; // Variable para almacenar la respuesta del perfil
  attemptedSubmit: boolean = false; // Variable para rastrear si se ha intentado enviar el formulario
  request: EditPerfilRequest = {} as EditPerfilRequest; // Objeto para almacenar la solicitud de edición del perfil

  constructor(
    private perfilService: PerfilService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtiene el rol del usuario desde el servicio de autenticación
    this.activatedRoute.params.subscribe(params => {
      this.getPerfilById(params['id']); // Llama al método para obtener el perfil por ID
    });
  }

  private getPerfilById(id: number) {
    this.perfilService.getPerfilById({id: id})
      .pipe()
      .subscribe({
        next: (response: GetPerfilByIdResponse) => {
          this.perfilResponse = response; // Almacena la respuesta del perfil obtenida
        }
      });
  }

  logOut() {
    this.authService.logOut(); // Llama al método de cierre de sesión del servicio de autenticación

    const closeButton = document.getElementById('x');
    closeButton?.click(); // Cierra algún modal o ventana emergente activa, si existe

    this.router.navigate(['']); // Navega a la página de inicio de sesión después de cerrar sesión
  }

}
