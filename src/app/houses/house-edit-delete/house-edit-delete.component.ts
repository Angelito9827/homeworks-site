import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../services/house-service/house.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetHouseByIdResponse } from '../models/get-house-by-id/get-house-by-id-response';

@Component({
  selector: 'app-house-edit-delete',
  templateUrl: './house-edit-delete.component.html',
  styleUrl: './house-edit-delete.component.css'
})
export class HouseEditDeleteComponent {
  form!: FormGroup;
  url: any = '';
  fieldErrors = { emailError: false };
  houseResponse?: GetHouseByIdResponse;
  attemptedSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.activatedRoute.params
    .subscribe(params=>{
      this.getHouseById(params['id']);
    })
    this.createForm();
  }

  onSelectFile(event: any) {
    if (event && event.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (eventLoad) => {
        if (eventLoad && eventLoad.target) {
          this.url = eventLoad.target.result;
          console.log(this.url);
        }
      };
    }
  }

  public delete() {
    this.url = null;
  }
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  private getHouseById(id:number) {
    this.houseService.getHouseById({id:id})
    .pipe()
    .subscribe({
      next: (response: GetHouseByIdResponse) => {
        this.houseResponse = response;
      }
    })
   }

  validateFields() {}

  deleteHouse() {
    // Aquí puedes añadir la lógica para eliminar la casa
    console.log('Casa eliminada');
  }
}
