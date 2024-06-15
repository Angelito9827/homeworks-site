import { Component } from '@angular/core';
import { GetHouseListResponse } from '../models/get-house-list/get-house-list.response'; // Importación del modelo de respuesta GetHouseListResponse
import { GetHouseListRequest } from '../models/get-house-list/get-house-list.request'; // Importación del modelo de solicitud GetHouseListRequest
import { HouseService } from '../services/house-service/house.service'; // Importación del servicio HouseService
import { AuthService } from '../../auth/services/auth.service'; // Importación del servicio AuthService

@Component({
  selector: 'app-houses-list',
  templateUrl: './houses-list.component.html',
  styleUrls: ['./houses-list.component.css'], // Establecer styleUrls para estilos específicos del componente
})
export class HousesListComponent {
  user: string = ''; // Inicializar variable user para el rol del usuario
  response?: GetHouseListResponse; // Inicializar respuesta como GetHouseListResponse o undefined
  request: GetHouseListRequest = { page: 0, pageSize: 5 }; // Inicializar objeto request con valores predeterminados
  totalCount: number = 0; // Inicializar totalCount para el número total de elementos

  constructor(
    private houseService: HouseService, // Inyectar HouseService para métodos relacionados con las casas
    private authService: AuthService // Inyectar AuthService para obtener el rol del usuario
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtener el rol del usuario actual
    this.getHousesList(); // Llamar al método para obtener la lista de casas al inicializar el componente
  }

  private getHousesList() {
    this.houseService // Llamar al servicio para obtener la lista de casas
      .get(this.request)
      .pipe()
      .subscribe({
        next: (response: GetHouseListResponse) => {
          console.log(response); // Registrar la respuesta en la consola
          this.response = response; // Asignar la respuesta recibida al atributo response
          this.response.elements.forEach(value => {
            value.activeTasks = this.getTotalActiveTasks(); // Establecer el número aleatorio de tareas activas
            // Si la casa tiene el ID 21, asegurarse de que tenga 6 participantes
          if (value.id === 21) {
            value.houseMembers = 6; // Fijar el número de participantes en 6
          } else {
            value.houseMembers = this.getTotalHouseMembers(); // Para otras casas, número aleatorio
          }
        });
          this.totalCount = response.totalCount; // Establecer el totalCount con el valor total de elementos recibidos
        },
        // Manejar errores u otros casos
      });
  }

  onPageChange(page: number) {
    this.request.page = page - 1; // Establecer la página solicitada en base a la paginación
    this.getHousesList(); // Volver a obtener la lista de casas según la página seleccionada
  }

  getTotalHouseMembers(): number {
    return Math.floor(Math.random() * 6) + 1; // Generar un número aleatorio entre 1 y 6 para el número de miembros de la casa
  }

  getTotalActiveTasks(): number {
    return Math.floor(Math.random() * 20) + 1; // Generar un número aleatorio entre 1 y 20 para el número de tareas activas
  }
}
