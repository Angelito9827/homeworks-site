import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateTaskRequest } from '../models/create-task/create-task.request';
import { TaskService } from '../services/tasks-service/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetHouseMemberListByHouseIdResponse } from '../../houses/models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { HouseMemberService } from '../../houses/services/house-member-service/house-member.service';
import { HouseService } from '../../houses/services/house-service/house.service';
import { GetHouseByIdResponse } from '../../houses/models/get-house-by-id/get-house-by-id-response';
import { CategoryState } from '../models/category-status.enum';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.css']
})
export class AddTasksComponent implements OnInit {
  user: string = ''; // Variable para almacenar el rol del usuario
  form!: FormGroup; // Formulario reactivo para la creación de tareas
  url: any = ''; // URL para la imagen, si es necesario (no se usa en el código proporcionado)
  fieldErrors: { [key: string]: boolean } = {}; // Objeto para manejar errores de validación de campos
  request: CreateTaskRequest = {} as CreateTaskRequest; // Objeto para almacenar la solicitud de creación de tarea
  houseMembersResponse?: GetHouseMemberListByHouseIdResponse; // Respuesta de los miembros de la casa obtenidos del servicio
  houseResponse?: GetHouseByIdResponse; // Respuesta de la casa obtenida del servicio
  categories: { label: string, value: number }[] = []; // Lista de categorías de tareas disponibles
  houseId!: number; // ID de la casa

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private houseMemberService: HouseMemberService,
    private activatedRoute: ActivatedRoute,
    private houseService: HouseService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtiene el rol del usuario del servicio de autenticación
    this.activatedRoute.params.subscribe(params => {
      this.houseId = params['houseId']; // Obtiene el ID de la casa de los parámetros de la ruta
      this.createForm(); // Inicializa el formulario reactivo
      this.getHouseMembersByHouseId(params['houseId']); // Obtiene los miembros de la casa por su ID
      this.getHouseById(params['houseId']); // Obtiene los detalles de la casa por su ID
      this.getCategories(); // Obtiene las categorías disponibles para las tareas
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
    // Establece los valores del formulario en el objeto de solicitud de creación de tarea
    this.request.name = this.form.get('name')?.value;
    this.request.description = this.form.get('description')?.value;
    this.request.creationDate = new Date(); // Fecha de creación actual
    this.request.deadlineDate = this.form.get('deadlineDate')?.value; // Fecha límite de la tarea
    this.request.assignedTo = this.form.get('assignedTo')?.value; // Miembro asignado a la tarea
    this.request.assignedBy = 'Ángel'; // Persona que asigna la tarea (aquí está fijo, podrías cambiarlo según necesites)
    this.request.categoryId = this.form.get('category')?.value; // ID de la categoría de la tarea
    this.request.houseId = this.houseId; // ID de la casa
  }

  areAllStepsValid(): boolean {
    return this.form.valid; // Verifica si todos los campos del formulario son válidos
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
      return;
    }
    
    // Verifica si todos los pasos del formulario son válidos
    if (!this.areAllStepsValid()) {
      console.log('Not all steps are valid');
      return;
    }

    this.stablishRequest(); // Establece la solicitud de creación de tarea con los valores del formulario

    // Llama al servicio para crear la tarea
    this.taskService.createTask(this.request)
      .subscribe({
        next: (response) => {
          // Manejar la respuesta exitosa
          console.log('Task created successfully', response);
        },
        error: (err) => {
          // Manejar errores
          console.error('Error creating task', err);
        }
      });

    // Navega de regreso a la lista de casas después de crear la tarea
    this.router.navigate(['/houses']);
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

  private getCategories() {
    // Obtiene las categorías disponibles para las tareas
    this.categories = Object.keys(CategoryState)
      .filter(key => isNaN(Number(key))) // Filtra solo las claves que no son números (las enumeraciones en TypeScript son mixtas)
      .map(key => ({ label: key, value: (CategoryState as any)[key] })); // Mapea las categorías en un formato de etiqueta y valor
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
}
