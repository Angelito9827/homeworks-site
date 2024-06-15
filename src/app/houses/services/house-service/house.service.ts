import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; // Importar configuración de entorno
import { HttpClient, HttpParams } from '@angular/common/http'; // Importar módulos de HttpClient y HttpParams
import { GetHouseListRequest } from '../../models/get-house-list/get-house-list.request'; // Importar modelo de solicitud GetHouseListRequest
import { Observable } from 'rxjs'; // Importar Observable de RxJS
import { GetHouseListResponse } from '../../models/get-house-list/get-house-list.response'; // Importar modelo de respuesta GetHouseListResponse
import { GetHouseByIdRequest } from '../../models/get-house-by-id/get-house-by-id.request'; // Importar modelo de solicitud GetHouseByIdRequest
import { GetHouseByIdResponse } from '../../models/get-house-by-id/get-house-by-id-response'; // Importar modelo de respuesta GetHouseByIdResponse
import { EditHouseRequest } from '../../models/edit-house/edit-house.request'; // Importar modelo de solicitud EditHouseRequest

@Injectable({
  providedIn: 'root', // Indicar que el servicio está disponible en el nivel raíz
})
export class HouseService {
  baseUrl = environment.baseUrlApi; // Establecer la URL base del API desde el entorno
  apiUrl = environment.api; // Establecer la URL del API desde el entorno

  constructor(private httpClient: HttpClient) {} // Inyectar HttpClient en el constructor

  // Método para obtener la lista de casas utilizando HTTP GET con parámetros de consulta
  public get(request: GetHouseListRequest): Observable<GetHouseListResponse> {
    let queryParams = new HttpParams(); // Crear instancia de HttpParams para los parámetros de consulta
    queryParams = queryParams
      .set('page', request.page.toString()) // Establecer el número de página
      .set('pageSize', request.pageSize.toString()); // Establecer el tamaño de página

    return this.httpClient.get<GetHouseListResponse>(`${this.apiUrl}house`, {
      params: queryParams, // Pasar los parámetros de consulta al endpoint
    });
  }

  // Método para crear una nueva casa utilizando HTTP POST con datos en el cuerpo (FormData)
  public createHouse(request: FormData): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}house`, request, {
      reportProgress: true, // Habilitar el reporte de progreso para la carga
      observe: 'events', // Observar los eventos de progreso
    });
  }

  // Método para obtener los detalles de una casa por su ID utilizando HTTP GET con parámetros de ruta
  public getHouseById(
    request: GetHouseByIdRequest
  ): Observable<GetHouseByIdResponse> {
    return this.httpClient.get<GetHouseByIdResponse>(
      `${this.apiUrl}house/${request.id}` // Endpoint para obtener detalles de una casa específica por ID
    );
  }

  // Método para editar una casa utilizando HTTP PUT con datos en el cuerpo (FormData)
  public editHouse(
    request: FormData
  ): Observable<GetHouseByIdResponse> {
    return this.httpClient.put<GetHouseByIdResponse>(
      `${this.apiUrl}house`, // Endpoint para editar una casa
      request // Datos a enviar en el cuerpo de la solicitud
    );
  }

  // Método para eliminar una casa por su ID utilizando HTTP DELETE con parámetros de ruta
  public deleteHouseById(
    request: GetHouseByIdRequest
  ): Observable<GetHouseByIdResponse> {
    return this.httpClient.delete<GetHouseByIdResponse>(
      `${this.apiUrl}house/${request.id}` // Endpoint para eliminar una casa específica por ID
    );
  }
}
