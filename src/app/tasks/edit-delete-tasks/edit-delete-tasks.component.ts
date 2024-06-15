import { Component } from '@angular/core';
import { HouseMemberService } from '../../houses/services/house-member-service/house-member.service';
import { GetHouseMemberListByHouseIdResponse } from '../../houses/models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetHouseByIdResponse } from '../../houses/models/get-house-by-id/get-house-by-id-response';
import { TaskService } from '../services/tasks-service/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../houses/services/house-service/house.service';
import { CategoryState } from '../models/category-status.enum';
import { EditTaskRequest } from '../models/edit-task/edit-task.request';
import { GetTaskByIdResponse } from '../models/get-active-task-by-id/get-active-task-by-id.response';
import { GetAllTasksListItemResponse } from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-edit-delete-tasks',
  templateUrl: './edit-delete-tasks.component.html',
  styleUrls: ['./edit-delete-tasks.component.css']
})
export class EditDeleteTasksComponent {
  user: string = ''; // Variable para almacenar el rol del usuario
  form!: FormGroup; // Formulario reactivo para la edición de tarea
  url: any = ''; // URL para la imagen, si es necesario (no se usa en el código proporcionado)
  houseMembersResponse?: GetHouseMemberListByHouseIdResponse; // Respuesta de los miembros de la casa obtenidos del servicio
  houseResponse?: GetHouseByIdResponse; // Respuesta de la casa obtenida del servicio
  categories: { label: string, value: number }[] = []; // Lista de categorías de tareas disponibles
  request: EditTaskRequest = {} as EditTaskRequest; // Objeto para almacenar la solicitud de edición de tarea
  taskResponse?: GetTaskByIdResponse; // Respuesta de la tarea obtenida por su ID
  selectedAssignedTo: string = ''; // Variable para almacenar al miembro asignado seleccionado
  activeTasksResponse?: GetAllTasksListItemResponse; // Respuesta de la lista de tareas activas obtenida del servicio
  id!: number; // ID de la tarea

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private houseMemberService: HouseMemberService,
    private houseService: HouseService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtiene el rol del usuario del servicio de autenticación

    this.activatedRoute.params.subscribe(params => {
      this.id = params['taskId']; // Obtiene el ID de la tarea de los parámetros de la ruta
      this.createForm(); // Inicializa el formulario reactivo
      this.getHouseMembersByHouseId(params['houseId']); // Obtiene los miembros de la casa por su ID
      this.getCategories(); // Obtiene las categorías disponibles para las tareas
      this.getTaskById(this.id); // Obtiene los detalles de la tarea por su ID
      this.getHouseById(params['houseId']); // Obtiene los detalles de la casa por su ID
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]], // Campo para el nombre de la tarea (requerido)
      description: ['', [Validators.required]], // Campo para la descripción de la tarea (requerido)
      assignedTo: ['', [Validators.required]], // Campo para asignar la tarea a un miembro de la casa (requerido)
      category: ['', [Validators.required]], // Campo para seleccionar la categoría de la tarea (requerido)
      deadlineDate: ['', [Validators.required]] // Campo para la fecha límite de la tarea (requerido)
    });
  }

  stablishRequest() {
    this.request.id = this.id; // ID de la tarea
    this.request.name = this.form.get('name')?.value; // Nombre de la tarea
    this.request.description = this.form.get('description')?.value; // Descripción de la tarea
    this.request.assignedTo = this.form.get('assignedTo')?.value; // Miembro asignado a la tarea
    this.request.categoryId = this.form.get('category')?.value; // ID de la categoría de la tarea
    this.request.deadlineDate = this.form.get('deadlineDate')?.value; // Fecha límite de la tarea
  }

  areAllStepsValid(): boolean {
    return this.form.valid; // Verifica si todos los campos del formulario son válidos
  }

  saveForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
      return;
    }

    if (!this.areAllStepsValid()) {
      console.log('Not all steps are valid');
      return;
    }

    this.stablishRequest(); // Establece la solicitud de edición de tarea con los valores del formulario

    this.taskService.editTask(this.request)
      .subscribe({
        next: (taskResponse) => {
          // Manejar la respuesta exitosa
          console.log('Task edited successfully', taskResponse);
        },
        error: (err) => {
          // Manejar errores
          console.error('Error editing task', err);
        }
      });

    this.router.navigate(['/houses']); // Navega de regreso a la lista de casas después de editar la tarea
  }

  private getHouseMembersByHouseId(id: number) {
    // Obtiene la lista de miembros de la casa por su ID
    this.houseMemberService.getHouseMembersByHouseId({ houseId: id })
      .subscribe({
        next: (response: GetHouseMemberListByHouseIdResponse) => {
          this.houseMembersResponse = response; // Almacena la respuesta de los miembros de la casa
        },
      });
  }

  private getHouseById(id: number) {
    // Obtiene los detalles de la casa por su ID
    this.houseService.getHouseById({ id: id })
      .subscribe({
        next: (response: GetHouseByIdResponse) => {
          this.houseResponse = response; // Almacena la respuesta de la casa
        },
      });
  }

  private getTaskById(id: number) {
    // Obtiene los detalles de la tarea por su ID
    this.taskService.getTaskById({ id: id })
      .subscribe({
        next: (response: GetTaskByIdResponse) => {
          this.taskResponse = response; // Almacena la respuesta de la tarea
          this.selectedAssignedTo = this.taskResponse.assignedTo; // Almacena al miembro asignado seleccionado
        }
      });
  }

  private getCategories() {
    // Obtiene las categorías disponibles para las tareas
    this.categories = Object.keys(CategoryState)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ label: key, value: (CategoryState as any)[key] }));
  }

  // Obtiene la fecha mínima en formato de cadena (YYYY-MM-DD)
  getMinDate(): string {
    const today = new Date(); // Obtiene la fecha actual
    const year = today.getFullYear(); // Obtiene el año
    let month: string | number = today.getMonth() + 1; // Obtiene el mes
    let day: string | number = today.getDate(); // Obtiene el día

    // Formatea el mes y el día para que tengan dos dígitos
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    // Retorna la fecha mínima en formato YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }

  deleteTaskById() {
    // Elimina la tarea por su ID
    this.taskService.deleteTaskById({ id: this.id })
      .subscribe({
        next: (taskResponse) => {
          // Manejar la respuesta exitosa si es necesario
          console.log('Task deleted successfully', taskResponse);
        },
        error: (err) => {
          // Manejar errores si es necesario
          console.error('Error deleting task', err);
        }
      });

    const closeButton = document.getElementById('x'); // Busca el botón de cierre
    closeButton?.click(); // Simula un clic en el botón de cierre

    this.router.navigate(['/houses', this.houseResponse?.id]); // Navega de regreso a la lista de casas con el ID de la casa
    alert("Tarea eliminada correctamente"); // Muestra una alerta de que la tarea se eliminó correctamente
  }
}
