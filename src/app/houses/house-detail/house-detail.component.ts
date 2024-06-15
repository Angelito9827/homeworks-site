import { Component } from '@angular/core';
import { TaskService } from '../../tasks/services/tasks-service/task.service';
import { GetAllTasksResponse } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { GetAllTasksRequest } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../services/house-service/house.service';
import { GetHouseByIdResponse } from '../models/get-house-by-id/get-house-by-id-response';
import { GetHouseMemberListByHouseIdResponse } from '../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { HouseMemberService } from '../services/house-member-service/house-member.service';
import { TaskState } from '../../tasks/models/task-status.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendInvitationEmailRequest } from '../models/send-invitation-email/send-invitation-email.request';
import { CategoryState } from '../../tasks/models/category-status.enum';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.css'] // Establecer los estilos específicos del componente
})
export class HouseDetailComponent {
  user: string = ''; // Variable para almacenar el rol del usuario actual
  activeTasksResponse?: GetAllTasksResponse; // Respuesta de tareas activas, opcional
  houseResponse?: GetHouseByIdResponse; // Respuesta de detalles de la casa, opcional
  houseMembersResponse?: GetHouseMemberListByHouseIdResponse; // Respuesta de miembros de la casa, opcional
  form!: FormGroup; // Formulario como FormGroup
  request: SendInvitationEmailRequest = { // Objeto de solicitud para enviar invitación por correo
    email: '',
    houseId: 0,
  };
  categories = CategoryState; // Variable para almacenar el estado de las categorías (enum)

  constructor(
    private taskService: TaskService, // Servicio para operaciones relacionadas con tareas
    private houseService: HouseService, // Servicio para operaciones relacionadas con casas
    private activatedRoute: ActivatedRoute, // Para acceder a los parámetros de la ruta actual
    private houseMemberService: HouseMemberService, // Servicio para operaciones relacionadas con miembros de la casa
    private formBuilder: FormBuilder, // Constructor de formularios para crear formularios reactivos
    private router: Router, // Para la navegación entre vistas
    private authService: AuthService // Servicio de autenticación para obtener el rol del usuario
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtener el rol del usuario actual desde el servicio de autenticación
    this.activatedRoute.params // Suscribirse a los parámetros de la ruta actual
      .subscribe(params => {
        this.getActiveTasksByHouseId(params['id']); // Obtener tareas activas por ID de la casa
        this.getHouseById(params['id']); // Obtener detalles de la casa por ID
        this.getHouseMembersByHouseId(params['id']); // Obtener miembros de la casa por ID
      });

    this.createForm(); // Inicializar la creación del formulario
  }

  private getActiveTasksByHouseId(id: number) {
    let request: GetAllTasksRequest = { houseId: id, taskState: TaskState.IN_PROGRESS }; // Configurar la solicitud para obtener tareas activas
    this.taskService.getAllTasks(request) // Llamar al método del servicio para obtener todas las tareas
      .pipe()
      .subscribe({
        next: (response: GetAllTasksResponse) => {
          console.log(response); // Mostrar respuesta en la consola
          this.activeTasksResponse = response; // Asignar la respuesta a activeTasksResponse
        }
      });
  }

  private getHouseById(id: number) {
    this.houseService.getHouseById({ id: id }) // Llamar al método del servicio para obtener detalles de la casa por ID
      .pipe()
      .subscribe({
        next: (response: GetHouseByIdResponse) => {
          this.houseResponse = response; // Asignar la respuesta a houseResponse
        }
      });
  }

  private getHouseMembersByHouseId(id: number) {
    this.houseMemberService.getHouseMembersByHouseId({ houseId: id }) // Llamar al método del servicio para obtener miembros de la casa por ID de la casa
      .pipe()
      .subscribe({
        next: (response: GetHouseMemberListByHouseIdResponse) => {
          console.log(response); // Mostrar respuesta en la consola
          this.houseMembersResponse = response; // Asignar la respuesta a houseMembersResponse
        }
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Definir control 'email' con validadores de requerido y formato de correo electrónico
    });
  }

  stablishRequest() {
    this.request.email = this.form.get('email')?.value; // Establecer el valor del correo electrónico en el objeto de solicitud desde el formulario
  }

  areAllStepsValid(): boolean {
    return this.form.valid; // Verificar si el formulario es válido
  }

  onSendInvitationButton() {
    if (this.form.invalid) { // Verificar si el formulario es inválido
      this.form.markAllAsTouched(); // Marcar todos los controles del formulario como tocados para mostrar errores de validación
      return;
    }

    if (!this.areAllStepsValid()) { // Verificar si todas las etapas del formulario son válidas
      console.log('Not all steps are valid'); // Mostrar mensaje si no todas las etapas son válidas
      return;
    }

    this.stablishRequest(); // Establecer el objeto de solicitud con los valores del formulario
    console.log('Request stablished'); // Mostrar mensaje de solicitud establecida
    
    // Enviar correo de invitación utilizando el servicio de miembros de la casa
    this.houseMemberService.sendInvitationEmail(this.request)
      .pipe()
      .subscribe({
        next: () => {
          console.log('Miembro añadido exitosamente'); // Mostrar mensaje de éxito
          const closeButton = document.getElementById('x'); // Obtener referencia al botón de cierre
          closeButton?.click(); // Simular clic en el botón de cierre
          this.resetForm(); // Resetear el formulario después de enviar la invitación
        }
      });
  }

  resetForm() {
    this.form.reset(); // Resetear los controles del formulario al estado inicial
    this.form.markAsPristine(); // Marcar el formulario como prístino (sin cambios)
    this.form.markAsUntouched(); // Marcar el formulario como no tocado (sin interacción)
  }

  deleteMemberByHouseId() {
    console.log('Miembro eliminado'); // Mostrar mensaje de eliminación
    this.houseMemberService.deleteMemberByHouseId(this.request) // Llamar al método del servicio para eliminar un miembro por ID de la casa
      .pipe()
      .subscribe({
        next: (houseMembersResponse) => {
          // Manejar la respuesta si es necesario
        },
        error: (err) => {
          // Manejar el error si falla la eliminación
        },
      });

    const closeButton = document.getElementById('x'); // Obtener referencia al botón de cierre
    closeButton?.click(); // Simular clic en el botón de cierre
    
    this.router.navigate(['/houses/', this.houseResponse?.id]); // Navegar a la página de detalles de la casa después de la eliminación
    alert("Miembro eliminado correctamente"); // Mostrar mensaje de alerta para confirmar la eliminación exitosa
  }

}
